import React from 'react';
import {EditBtree} from './EditBtree.tsx';
import { BTNode } from './types';
import { useState } from 'react';
import {Tree, TreeNode} from 'react-organizational-chart';

/** Turns a btree into a nice visual OrgChart. Top level gets a different node.
 * The rest is delegated to btreeToJSX.
 */
export function Btree(props) : JSX.Element  {

 const [text, setText] = useState("");
 const [edit, setEdit] = useState(false);
  const { head, label } = props;


  return (
    <div className="bTree">
      <Tree label={props.label}>{btreeToJSX(head, 0)}</Tree>
    </div>

   
  );


//Recursively convert our btree to a OrgChart JSX element tree.
 function btreeToJSX(node: BTNode, index: number): JSX.Element {
    console.log("rendering node ", node.value, " at index ", index);
    
    function updateNodeValue(node: BTNode, index: number) {
        console.log("🔧 updateNodeValue called with:", { value: node.value, nodeId: node.nodeId, index });
        props.updateNodeValue(node, index);
    }

function addLeftNode() {
  const newNode: BTNode = {
    value: 'new',
    left: node.left,
    right: null,
    nodeId: '',
    index: 0
  };

  node.left = newNode;

  // The empty nodeId causes handleUpdate() to call /create
  updateNodeValue(newNode, index);
}

function addRightNode() {
  const newNode: BTNode = {
    value: 'new',
    left: null,
    right: node.right,
    nodeId: '',
    index: 0
  };

  node.right = newNode;

  // The empty nodeId causes handleUpdate() to call /create
  updateNodeValue(newNode, index);
}

    function deleteLeftChild() {
        if (node.left) {
            console.log("✕ Deleting left child of node:", node.value);
            node.left = null;
            updateNodeValue(node, index);
        }
    }

    function deleteRightChild() {
        if (node.right) {
            console.log("✕ Deleting right child of node:", node.value);
            node.right = null;
            updateNodeValue(node, index);
        }
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
