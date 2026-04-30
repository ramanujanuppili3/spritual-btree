import React, { useState, useEffect } from 'react';
import { BTNode } from './types.ts';

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
    index: number
  ): BTNode | null {
    if (!node) return null;

    if (node.index === index) {
      return { ...node, value: node.value };
    }

    return {
      ...node,
      left: updateNodeAtIndex(node.left, index),
      right: updateNodeAtIndex(node.right, index),
    };
  }

  // ✅ FIXED: Handle update - properly update tree
  function handleUpdate(node: BTNode, index: number): void {
    console.log("🔧 Updating node at index:", index);
    console.log("   Node value:", node.value);
    console.log("   Current tree:", tree);

    // Update tree with new node at index
    const updatedTree = updateNodeAtIndex(tree, index);
    setTree(updatedTree);
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