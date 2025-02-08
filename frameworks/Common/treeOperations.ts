let nextId = 1;

const A = ["pretty","large","big","small","tall","short","long","handsome","plain","quaint","clean",
  "elegant","easy","angry","crazy","helpful","mushy","odd","unsightly","adorable","important","inexpensive",
  "cheap","expensive","fancy"];
const C = ["red","yellow","blue","green","pink","brown","purple","brown","white","black","orange"];
const N = ["table","chair","house","bbq","desk","car","pony","cookie","sandwich","burger","pizza","mouse",
  "keyboard"];

/** Resets the ID counter for fresh trees (optional). */
export function resetNextId() {
  nextId = 1;
}

/** Returns a new random index within [0, max-1]. */
function random(max) {
  return Math.round(Math.random() * 1000) % max;
}

/** Builds a binary tree of specified depth. */
export function buildTreeData(depth = 5) {
  if (depth === 0) return null;
  const node = {
    id: nextId++,
    label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
    left: buildTreeData(depth - 1),
    right: buildTreeData(depth - 1),
  };
  return node;
}

/** Finds node by ID in a binary tree. Returns the node or null if not found. */
export function findNode(nodeId, tree) {
  if (!tree) return null;
  if (tree.id === nodeId) return tree;
  const leftResult = findNode(nodeId, tree.left);
  if (leftResult) return leftResult;
  const rightResult = findNode(nodeId, tree.right);
  return rightResult || null;
}

/** Returns a new tree with updated label if found; otherwise null. */
export function findAnUpdate(nodeId, tree, newText) {
  if (!tree) return null;
  if (tree.id === nodeId) {
    // Found the node, append newText to its label
    return { ...tree, label: tree.label + newText };
  }

  const left = findAnUpdate(nodeId, tree.left, newText);
  if (left) {
    return { ...tree, left };
  }
  const right = findAnUpdate(nodeId, tree.right, newText);
  if (right) {
    return { ...tree, right };
  }
  return null;
}

/** Swaps the left/right children of the node with nodeId. */
export function swapTwoNodes(nodeId, tree) {
  if (!tree) return null;

  // Find node
  const target = findNode(nodeId, tree);
  if (!target) return tree; // Node not found, do nothing

  // Swap children in-place
  const { left, right } = target;
  target.left = right;
  target.right = left;

  // Return same reference (but you might clone the entire tree if needed)
  return { ...tree };
}

/** Removes the node with nodeId, returns a new root. */
export function removeNodeById(root, nodeId) {
  if (!root) return null;
  // If the root itself is to be removed, return null
  if (root.id === nodeId) {
    return null;
  }
  // BFS approach to find the parent whose child is nodeId
  const queue = [root];
  while (queue.length) {
    const current = queue.shift();
    if (!current) continue;

    // Check left child
    if (current.left) {
      if (current.left.id === nodeId) {
        current.left = null;
        return { ...root };
      } else {
        queue.push(current.left);
      }
    }
    // Check right child
    if (current.right) {
      if (current.right.id === nodeId) {
        current.right = null;
        return { ...root };
      } else {
        queue.push(current.right);
      }
    }
  }
  return root; // Node not found, return original
}

/** Attach a copy of the tree `copy` to the first leaf in `root`. */
export function attachCopyAtLeaf(root, copy) {
  console.log(root, copy)
  if (!root) return root;
  const queue = [root];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;

    if (!current.left && !current.right) {
      current.left = copy;
      console.log("leaf: ", current)
      return { ...root };
    }
    if (current.left) queue.push(current.left);
    if (current.right) queue.push(current.right);
  }
  return root;
}

export function traverseTree(tree) {
  console.log(tree)
  if (tree.left) traverseTree(tree.left);
  if (tree.right) traverseTree(tree.right);
}