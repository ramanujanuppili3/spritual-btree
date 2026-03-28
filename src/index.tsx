import React, { useState } from 'react';
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
  const [tree, setTree] = useState(() => createSampleTree(depth));

  function regenerate() {
    setTree(createSampleTree(depth));
  }

  function handleInvertCopying(node) {
    const inverted = invertTreeCopying(node);
    setTree(inverted);
  }

    function updateNodeAtIndex(node: BTNode | null, index: number): BTNode | null {
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

  // Function to update state
	function handleUpdate  (node : BTNode, index: number)  {
        console.log("Updating node value to "+console.log(node.value)+" at index "+node.index);
        // parse the tree and update the node at the given index
        setTree(updateNodeAtIndex(tree, index));
	};

  return (
    <div className="App">
      <h1>BTrees Viewer / Inverter</h1>
      {console.log("rendering tree ", JSON.stringify(tree))}
      <Btree head={tree} label="Sample binary tree" updateNodeValue={handleUpdate}/>
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

// render(<App />, document.getElementById('root'));
