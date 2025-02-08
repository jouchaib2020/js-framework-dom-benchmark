import { createSignal, createSelector, Show } from "solid-js";
import { render } from "solid-js/web";
import {
  buildTreeData,
  resetNextId,
  attachCopyAtLeaf,
  removeNodeById,
  swapTwoNodes,
  findAnUpdate,
  traverseTree
} from '../../../Common/treeOperations.ts';

// Button Component
const Button = ({ id, title, onClick }) => (
  <div class="col-sm-6 smallpad">
    <button
      id={id}
      class="btn btn-primary btn-block"
      type="button"
      onClick={onClick}
    >
      {title}
    </button>
  </div>
);

// Jumbotron Component
const Jumbotron = ({ run, runLots, add, update, clear, swapRows }) => (
  <div class="jumbotron">
    <div class="row">
      <div class="col-md-6">
        <h1>SolidJS Tree Benchmark</h1>
      </div>
      <div class="col-md-6">
        <div class="row">
          <Button id="run" title="Create 1,023 nodes tree" onClick={run} />
          <Button id="runlots" title="Create 16,383 nodes tree" onClick={runLots} />
          <Button id="add" title="Append 1,023 nodes" onClick={add} />
          <Button id="update" title="Update the middle element" onClick={update} />
          <Button id="clear" title="Clear" onClick={clear} />
          <Button id="swaprows" title="Swap two subtrees" onClick={swapRows} />
        </div>
      </div>
    </div>
  </div>
);

// TreeNode Component
const TreeNode = (props) => {
  const isSelected = createSelector(props.selected, () => props.selected() === props.node.id);

  return (
    <div class={`node ${isSelected() ? "selected" : ""}`} data-id={props.node.id}>
      <div class="node-label">
        <a onClick={() => props.setSelected(props.node.id)}>
          {props.node.id} {props.node.label}
        </a>
        <span onClick={() => props.removeNode(props.node.id)}>
          <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
        </span>
      </div>
      <div class="children">
        <Show when={props.node.left}>
          <TreeNode node={props.node.left} selected={props.selected} setSelected={props.setSelected} />
        </Show>
        <Show when={props.node.right}>
          <TreeNode node={props.node.right} selected={props.selected} setSelected={props.setSelected} />
        </Show>
      </div>
    </div>
  );
};

// Main Component
function MainSolid() {
  const N= 4;
  const [tree, setTree] = createSignal(null);
  const [selected, setSelected] = createSignal(null);

  // Action Handlers
  const run = () => {
    resetNextId();
    setTree(buildTreeData(N)); // Depth=10, ~1,023 nodes
    setSelected(null);
  };

  const runLots = () => {
    resetNextId();
    setTree(buildTreeData(14)); // Depth=14, ~16,383 nodes
    setSelected(null);
  };

  const add = () => {
    // const copy = buildTreeData(N);
    // const newTree = attachCopyAtLeaf(tree(), copy);
    // traverseTree(newTree);
    setTree(buildTreeData(N+1));
  };

  const update = () => {
    // Example: Update node with ID=512
    const updated = findAnUpdate(Math.pow(2, N)/2, tree(), " !!!!");
    if (updated) setTree(updated);
  };

  const clear = () => {
    resetNextId();
    setTree(null);
    setSelected(null);
  };

  const swapRows = () => {
    // Example: Swap subtrees rooted at ID=9 and ID=25
    const swapped = swapTwoNodes(N-1, tree());
    if (swapped) setTree(swapped);
  };

  const removeNode = (id) => {
    const removed = removeNodeById(tree(), id);
    setTree(removed);
    setSelected(null);
  };

  return (
    <div class="container">
      <Jumbotron
        run={run}
        runLots={runLots}
        add={add}
        update={update}
        clear={clear}
        swapRows={swapRows}
      />
      <div class="tree-container">
        <Show when={tree()}>
          <TreeNode node={tree} selected={selected} setSelected={setSelected} />
        </Show>
      </div>
      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
    </div>
  );
}

// Render the SolidJS App
render(() => <MainSolid />, document.getElementById("main"));
