import React, { useState, useEffect } from 'react';
import { BTNode } from './types.ts';
import { updateNodeById, updateNodeByIndex, batchUpdateNodes, createNode } from './services/treeApi.ts';

import {
  createSampleTree,
  invertTreeCopying,
  invertTreeInPlace,
} from './btree.ts';

import { Btree } from './Btree.tsx';

import './style.css';

export function App1() {
  const [depth, setDepth] = useState(5);
  const [tree, setTree] = useState<BTNode | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ FIXED: useEffect to load tree on mount
  useEffect(() => {
    console.log("🌳 App1 mounted - loading tree on startup");

    const loadTree = async (): Promise<void> => {
      try {
        setLoading(true);
        console.log("📡 Calling createSampleTree with depth:", depth);

        // ✅ Await the Promise to get BTNode
        const treeData: BTNode = await createSampleTree(depth);

        console.log("✅ Tree loaded successfully:", treeData);

        // ✅ Set the unwrapped BTNode to state
        setTree(treeData);

      } catch (err) {
        console.error("❌ Error loading tree:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTree();

  }, [depth]); // ✅ Re-run when depth changes

  // ✅ FIXED: useEffect to log tree updates - triggered when tree changes
  useEffect(() => {
    console.log("🎯 Tree state updated");

    if (tree) {
      console.log("Tree details:", {
        value: tree.value,
        index: tree.index.low,
        hasLeft: !!tree.left,
        hasRight: !!tree.right
      });
    }
  }, [tree]); // ✅ FIXED: Dependency on [tree] - runs when tree updates

  
  // ✅ FIXED: regenerate function - properly await and set tree
  async function regenerate(): Promise<void> {
    try {
      console.log("🔄 Regenerating tree with depth:", depth);

      setLoading(true);

      // ✅ Await Promise to get BTNode
      const newTree: BTNode = await createSampleTree(depth);

      console.log("✅ New tree generated:", newTree);

      // ✅ Set the BTNode to state
      setTree(newTree);

    } catch (err) {
      console.error("❌ Error regenerating tree:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleInvertCopying(node: BTNode | null): void {
    if (!node) return;

    const inverted = invertTreeCopying(node);
    console.log("✅ Tree inverted (copying)");
    setTree(inverted);
  }

  function handleInvertInPlace(node: BTNode | null): void {
    if (!node) return;

    const inverted = invertTreeInPlace(node);
    console.log("✅ Tree inverted (in place)");
    setTree(inverted);
  }

  function updateNodeAtIndex(
    node: BTNode | null,
    updatedNode: BTNode
  ): BTNode | null {
    if (!node) return null;

    // Compare node IDs if available, otherwise compare values and indices
    const isSameNode = node.nodeId && updatedNode.nodeId
      ? node.nodeId === updatedNode.nodeId
      : node.value === updatedNode.value;

    if (isSameNode) {
      return { ...node, ...updatedNode };
    }

    return {
      ...node,
      left: updateNodeAtIndex(node.left, updatedNode),
      right: updateNodeAtIndex(node.right, updatedNode),
    };
  }

  // ✅ Helper: Find parent node ID for a given node
  function findParentNodeId(currentNode: BTNode | null, targetNode: BTNode): string | null {
    if (!currentNode) return null;

    // Check if target is a direct child
    if (currentNode.left === targetNode || currentNode.right === targetNode) {
      return currentNode.nodeId || null;
    }

    // Recursively search in children
    const leftResult = findParentNodeId(currentNode.left, targetNode);
    if (leftResult) return leftResult;

    return findParentNodeId(currentNode.right, targetNode);
  }

  // ✅ Helper: Determine if node is left or right child
  function findNodePosition(currentNode: BTNode | null, targetNode: BTNode): 'left' | 'right' | null {
    if (!currentNode) return null;

    if (currentNode.left === targetNode) {
      return 'left';
    }

    if (currentNode.right === targetNode) {
      return 'right';
    }

    const leftResult = findNodePosition(currentNode.left, targetNode);
    if (leftResult) return leftResult;

    return findNodePosition(currentNode.right, targetNode);
  }

  // ✅ ENHANCED: Handle update with support for new nodes
  async function handleUpdate(node: BTNode, index: number): void {
    console.log("🔧 Updating node at index:", index);
    console.log("   Node value:", node.value);
    console.log("   Node ID:", node.nodeId);
    console.log("   Current tree:", tree);

    try {
      // Case 1: Node has an ID - it's an existing node, update it
      if (node.nodeId && node.nodeId.trim() !== '') {
        console.log("📝 Case 1: Updating existing node with ID:", node.nodeId);
        
        const response = await updateNodeById(node.nodeId, node.value);
        
        console.log("✅ Backend updated successfully:", response);
        
        // Update UI with the response data if available
        if (response.node) {
          const updatedTree = updateNodeAtIndex(tree, response.node);
          setTree(updatedTree);
        } else {
          // Just update the tree state locally
          const updatedTree = updateNodeAtIndex(tree, node);
          setTree(updatedTree);
        }
      } 
      // Case 2: Node has no ID - it's a new node, create it on backend
      else {
        console.log("➕ Case 2: Creating new node");
        
        // Find parent node to determine position
        const parentNodeId = findParentNodeId(tree, node);
        const position = findNodePosition(tree, node);
        
        console.log("   Parent Node ID:", parentNodeId);
        console.log("   Position:", position);

        if (!parentNodeId) {
          console.warn("⚠️ Could not find parent node ID, cannot create new node");
          return;
        }

        const response = await createNode(parentNodeId, position as 'left' | 'right', node.value);

        console.log("✅ Backend created successfully:", response);

        // Update the node with the new ID from backend
        if (response.node && response.node.nodeId) {
          const nodeWithId = { ...node, nodeId: response.node.nodeId };
          const updatedTree = updateNodeAtIndex(tree, nodeWithId);
          setTree(updatedTree);
          console.log("✅ Node now has ID:", response.node.nodeId);
        } else {
          const updatedTree = updateNodeAtIndex(tree, node);
          setTree(updatedTree);
        }
      }

    } catch (err) {
      console.error("❌ Error in handleUpdate:", err);
      // Still update UI locally even if backend fails
      const updatedTree = updateNodeAtIndex(tree, node);
      setTree(updatedTree);
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="App">
        <h1>🌳 BTrees Viewer / Inverter</h1>
        <p>Loading tree...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>🌳 BTrees Viewer / Inverter</h1>

      {/* Debug: Show tree state */}
      {console.log("Rendering tree:", JSON.stringify(tree))}

      {tree ? (
        <Btree head={tree} label="Sample binary tree" updateNodeValue={handleUpdate} />
      ) : (
        <p>No tree loaded. Click regenerate to load.</p>
      )}

      <br />

      <div className="controls">
        <div>
          <button onClick={() => handleInvertCopying(tree)}>
            invert tree (copying)
          </button>
          <button onClick={() => handleInvertInPlace(tree)}>
            invert tree (in place)
          </button>
        </div>

        <div>
          Depth:
          <input
            type="number"
            value={depth}
            min={1}
            max={7}
            onChange={(e) => setDepth(parseInt(e.target.value))}
          />
          <button onClick={regenerate}>regenerate</button>
        </div>
      </div>
    </div>
  );
}