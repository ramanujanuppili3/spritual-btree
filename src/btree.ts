import { BTNode } from './types';
let indexGlobal = 0;

export async function createSampleTree(
  maxDepth: number,
  currDepth: number = 1
): Promise<BTNode> {
  indexGlobal += 1;
  //TODO: make it a sorted tree?
  const index = indexGlobal;

  try {
    const response = await fetch('http://localhost:3005/api/btree/nested');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Extract JSON response and build the nested tree
    const data = await response.json();
    const tree: BTNode = buildNestedTree(data, currDepth, maxDepth);

    console.log('Full nested tree structure:', tree);

    // Ensure the returned node conforms to BTNode shape by attaching index
    return { ...tree, index };
  } catch (error) {
    console.error('Error extracting JSON:', error);
    throw error;
  }
}


// Build nested tree structure recursively
function buildNestedTree(
  data: any,
  currDepth: number = 1,
  maxDepth: number = 3
): BTNode {
  if (!data) return {} as BTNode;

  const node: BTNode = {
    // index: normalizeIndex(data.index),
    value: data.value
  };

  // Add left subtree if exists and depth not exceeded
  if (data.left && currDepth < maxDepth) {
    node.left = buildNestedTree(data.left, currDepth + 1, maxDepth);
  } 
  // else if (data.left) {
  //   node.left = {
  //     // index: normalizeIndex(data.left.index),
  //     value: data.left.value
  //   };
  // }

  // Add right subtree if exists and depth not exceeded
  if (data.right && currDepth < maxDepth) {
    node.right = buildNestedTree(data.right, currDepth + 1, maxDepth);
  } 
  // else if (data.right) {
  //   node.right = {
  //     // index: normalizeIndex(data.right.index),
  //     value: data.right.value
  //   };
  // }

  return node;
}


// Normalize index format
function normalizeIndex(index: any): { low: number; high: number } {
  if (typeof index === 'number') {
    return { low: index, high: 0 };
  }
  return index;
}


// async function fetchTreeNode(): Promise<BTNode> {
//   const response = await fetch('http://localhost:3000/api/btree/nested');
//   const treeNode: BTNode = response;
//   return await response.json(); // Returns BTNode inside Promise
// }

/**
 * Mutate the given tree so that it is the mirror of its original self.
 *
 * (An alternative to invertTreeCopying)
 */
export function invertTreeInPlace(node: BTNode): BTNode {
  //Note, we make no new objects, nor copies of objects.
  const newLeft = node.right ? invertTreeInPlace(node.right) : null;
  const newRight = node.left ? invertTreeInPlace(node.left) : null;
  node.left = newLeft;
  node.right = newRight;
  return node;
}

/** make a new (not mutated) tree which is the mirror of the given one.
 *
 * (An alternative to invertTreeInPlace)
 */
export function invertTreeCopying(node: BTNode): BTNode {
  const left = node.right ? invertTreeCopying(node.right) : null;
  const right = node.left ? invertTreeCopying(node.left) : null;

  //shallow copy the object with its properties, overwrite left and right.
  return { ...node, left, right };
}

function randomHexCode(): string {
  return Math.floor(Math.random() * 16777215).toString(16);
}
