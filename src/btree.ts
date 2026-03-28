import { BTNode } from './types';
let indexGlobal = 0;

export function createSampleTree(
  maxDepth: number,
  currDepth: number = 1
): BTNode {
    indexGlobal += 1;
  //TODO: make it a sorted tree?
  let left = null;
  let right = null;
  let index = indexGlobal;
  if (currDepth < maxDepth) {
    left = createSampleTree(maxDepth, currDepth + 1);
    right = createSampleTree(maxDepth, currDepth + 1);
  }
  console.log("index   ", index);
  return { left, right, value: '' + randomHexCode() , index};
}

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
