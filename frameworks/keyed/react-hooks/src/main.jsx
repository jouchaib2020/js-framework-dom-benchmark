import React, { useReducer, memo } from 'react';
import { createRoot } from 'react-dom/client';

import {
  buildTreeData,
  resetNextId,
  attachCopyAtLeaf,
  removeNodeById,
  swapTwoNodes,
  findAnUpdate
} from '../../../Common/treeOperations'

const initialTreeState = { tree: null, selected: null };

const N = 10;
function treeReducer(state, action) {
  switch (action.type) {
    case 'RUN':
      resetNextId();
      return { tree: buildTreeData(N), selected: null };

    case 'RUN_LOTS':
      resetNextId();
      return { tree: buildTreeData(14), selected: null };

    case 'ADD':
      // Build a brand new tree to attach
      const copy = buildTreeData(N);
      // Attach to a leaf in the existing tree
      const withCopy = attachCopyAtLeaf(state.tree, copy);
      return { ...state, tree: withCopy };

    case 'UPDATE':
      const middleNode = Math.floor(Math.pow(2, N) / 2);
      const updated = findAnUpdate(middleNode, state.tree, '!!!!');
      if (!updated) return state; // If not found, do nothing
      return { ...state, tree: updated };

    case 'CLEAR':
      resetNextId();
      return { tree: null, selected: null };

    case 'SWAP_ROWS':
      // For example, swapping the node with ID=9
      const swapped = swapTwoNodes(9, state.tree);
      return { ...state, tree: swapped || state.tree };

    case 'SELECT':
      return { ...state, selected: action.id };

    case 'REMOVE':
      const removed = removeNodeById(state.tree, action.id);
      return { ...state, tree: removed, selected: null };

    default:
      return state;
  }
}

const TreeNode = ({ node, selected, dispatch, parentSelected }) => {
  if (!node) return null;
  const isSelected = selected === node.id;

  return (
    <div
      className={`node ${isSelected && !parentSelected ? 'selected' : ''} ${
        parentSelected ? 'parent-selected' : ''
      }`}
      data-id={node.id}
    >
      <div className="node-label">
        <a onClick={() => dispatch({ type: 'SELECT', id: node.id })}>
          {node.id} {node.label}
        </a>
        <span onClick={() => dispatch({ type: 'REMOVE', id: node.id })}>
          <span className="glyphicon glyphicon-remove" aria-hidden="true" />
        </span>
      </div>
      <div className="children">
        {node.left && (
          <TreeNode
            node={node.left}
            selected={selected}
            dispatch={dispatch}
            parentSelected={isSelected}
          />
        )}
        {node.right && (
          <TreeNode
            node={node.right}
            selected={selected}
            dispatch={dispatch}
            parentSelected={isSelected}
          />
        )}
      </div>
    </div>
  );
};

const Button = ({ id, cb, title }) => (
  <div className="col-sm-6 smallpad">
    <button type="button" className="btn btn-primary btn-block" id={id} onClick={cb}>
      {title}
    </button>
  </div>
);

const Jumbotron = memo(({ dispatch }) => (
  <div className="jumbotron">
    <div className="row">
      <div className="col-md-6">
        <h1>React Hooks keyed</h1>
      </div>
      <div className="col-md-6">
        <div className="row">
          <Button id="run" title="Create 1023 nodes tree" cb={() => dispatch({ type: 'RUN' })} />
          <Button id="runlots" title="Create 1683 nodes tree" cb={() => dispatch({ type: 'RUN_LOTS' })} />
          <Button id="add" title="Append 1023 nodes" cb={() => dispatch({ type: 'ADD' })} />
          <Button id="update" title="update the middle element" cb={() => dispatch({ type: 'UPDATE' })} />
          <Button id="clear" title="Clear" cb={() => dispatch({ type: 'CLEAR' })} />
          <Button id="swaprows" title="swap two subtrees" cb={() => dispatch({ type: 'SWAP_ROWS' })} />
        </div>
      </div>
    </div>
  </div>
));

function Main() {
  const [{ tree, selected }, dispatch] = useReducer(treeReducer, initialTreeState);

  return (
    <div className="container">
      <Jumbotron dispatch={dispatch} />
      <div className="tree-container">
        {tree && (
          <TreeNode node={tree} selected={selected} dispatch={dispatch} />
        )}
      </div>
      <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
    </div>
  );
}

createRoot(document.getElementById("main")).render(<Main />);

