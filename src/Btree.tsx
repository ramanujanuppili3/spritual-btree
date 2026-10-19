import React from 'react';
import {EditBtree} from './EditBtree.tsx';
import { BTNode } from './types';
import { useState } from 'react';
import {Tree, TreeNode} from 'react-organizational-chart';
import { deleteChildRelationship } from './services/treeApi.ts';

/** Turns a btree into a nice visual OrgChart. Top level gets a different node.
 * The rest is delegated to btreeToJSX.
 */
export function Btree(props) : JSX.Element  {
 const { head, label, refreshTree } = props;
 const [text, setText] = useState("");
 const [edit, setEdit] = useState(false);


  return (
    <div className="bTree">
      <Tree label={props.label}>{btreeToJSX(head, 0)}</Tree>
    </div>

   
  );


//Recursively convert our btree to a OrgChart JSX element tree.
 function btreeToJSX(node: BTNode, index: number): JSX.Element {
    console.log("rendering node ", node.value, " at index ", index);
    
async function updateNodeValue(
  node: BTNode,
  index: number
): Promise<void> {
  console.log("🔧 updateNodeValue called with:", { value: node.value, nodeId: node.nodeId, index });
  await props.updateNodeValue(node, index);
}

 async function addLeftNode() {
  const previousLeft = node.left;

  const newNode: BTNode = {
    value: 'new',
    left: previousLeft,
    right: null,
    nodeId: '',
    index: 0
  };

  node.left = newNode;

  try {
    await updateNodeValue(newNode, index);
  } catch (error) {
    node.left = previousLeft;
    console.error('Failed to create left node:', error);
  }
}

async function addRightNode() {
  const previousRight = node.right;

  const newNode: BTNode = {
    value: 'new',
    left: null,
    right: previousRight,
    nodeId: '',
    index: 0
  };

  node.right = newNode;

  try {
    await updateNodeValue(newNode, index);
  } catch (error) {
    node.right = previousRight;
    console.error('Failed to create right node:', error);
  }
}

async function deleteLeftChild() {
  const child = node.left;
  const parentId = node.nodeId;

  console.log('✕ deleteLeftChild called for node:', node.value, 'nodeId:', parentId);

  // If we have a backend id for the parent and a refreshTree function, call backend
  if (parentId && typeof refreshTree === 'function') {
    try {
      console.log('✕ attempting backend delete-left for parentId:', parentId);
      await deleteChildRelationship(parentId, 'left'); // ensure this function exists (services/treeApi.ts)
      console.log('✕ backend delete-left succeeded, refreshing tree from server');
      await refreshTree();
      return;
    } catch (err) {
      console.error('✕ backend delete-left failed, will fall back to local promotion:', err);
      // continue to fallback behavior
    }
  } else {
    console.log('✕ refreshTree not available or parentId missing — using local fallback');
  }

  // Local fallback (mutate in-memory node then call updateNodeValue)
  if (!child) {
    console.warn('✕ deleteLeftChild: no left child to delete');
    return;
  }

  console.log('✕ Performing local promotion for left child:', child.value);

  if (!child.left && !child.right) {
    node.left = null;
    console.log('✕ local: child had no grandchildren — removed immediate left child');
  } else if (child.left && !child.right) {
    node.left = child.left;
    console.log('✕ local: promoted child.left into node.left');
  } else if (!child.left && child.right) {
    node.left = child.right;
    console.log('✕ local: promoted child.right into node.left');
  } else {
    node.left = child.left;
    let current: BTNode = node.left as BTNode;
    while (current.right) {
      current = current.right as BTNode;
    }
    current.right = child.right;
    console.log('✕ local: promoted left subtree and attached right subtree to far-right');
  }

  updateNodeValue(node, index);
}

async function deleteRightChild() {
  const child = node.right;
  const parentId = node.nodeId;

  console.log('✕ deleteRightChild called for node:', node.value, 'nodeId:', parentId);

  if (parentId && typeof refreshTree === 'function') {
    try {
      console.log('✕ attempting backend delete-right for parentId:', parentId);
      await deleteChildRelationship(parentId, 'right');
      console.log('✕ backend delete-right succeeded, refreshing tree from server');
      await refreshTree();
      return;
    } catch (err) {
      console.error('✕ backend delete-right failed, falling back to local promotion:', err);
      // fallback
    }
  } else {
    console.log('✕ refreshTree not available or parentId missing — using local fallback');
  }

  if (!child) {
    console.warn('✕ deleteRightChild: no right child to delete');
    return;
  }

  console.log('✕ Performing local promotion for right child:', child.value);

  if (!child.left && !child.right) {
    node.right = null;
    console.log('✕ local: child had no grandchildren — removed immediate right child');
  } else if (!child.left && child.right) {
    node.right = child.right;
    console.log('✕ local: promoted child.right into node.right');
  } else if (child.left && !child.right) {
    node.right = child.left;
    console.log('✕ local: promoted child.left into node.right');
  } else {
    node.right = child.right;
    let current: BTNode = node.right as BTNode;
    while (current.left) {
      current = current.left as BTNode;
    }
    current.left = child.left;
    console.log('✕ local: promoted right subtree and attached left subtree to far-left');
  }

  updateNodeValue(node, index);
}

  return (
    <TreeNode
      label={
        <div className="btreeNode-container">
          <div
            className="btreeNode"
            title={node.value}
            style={{
              background: '#' + node.value,
            }}
          >
            {/* abbreviated label */}
            {/* {node.value.slice(0, 2).toUpperCase()} */}
            
            <input 
              type="text" 
              value={node.value.toUpperCase()} 
              onChange={e => {
                const newValue = e.target.value;
                node.value = newValue;
                console.log("✏️ Node value changed to:", newValue);
                updateNodeValue(node, index);
              }}
              onBlur={() => {
                console.log("✏️ Input blur - ensuring update is saved for node:", node.nodeId);
                updateNodeValue(node, index);
              }}
              className="node-input"
            />
          </div>
          
          {/* Node action buttons - Always enabled */}
          <div className="node-actions">
            <button 
              onClick={addLeftNode}
              className="btn-add-left"
              title="Add/insert left child (moves existing child under new node if exists)"
            >
              +L
            </button>
            <button 
              onClick={addRightNode}
              className="btn-add-right"
              title="Add/insert right child (moves existing child under new node if exists)"
            >
              +R
            </button>
            {node.left && (
              <button 
                onClick={deleteLeftChild}
                className="btn-delete-left"
                title="Delete left child and its subtree"
              >
                ✕L
              </button>
            )}
            {node.right && (
              <button 
                onClick={deleteRightChild}
                className="btn-delete-right"
                title="Delete right child and its subtree"
              >
                ✕R
              </button>
            )}
          </div>
        </div>
      }
    >
      {node.left && btreeToJSX(node.left, ++index)}
      {node.right && btreeToJSX(node.right, ++index)}
    </TreeNode>
  );
}

}


function toggleState()   {
//  const newNode = new Node();
console.log("toggling state");
  this.setState({showEdit: !this.state.showEdit});
}
