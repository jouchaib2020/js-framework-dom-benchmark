import { useState } from "react";

import Node from "./Node.jsx";

export default function Scenario5() {
  const [branchingFactor, setBranchingFactor] = useState(0);
  const [treeDepth, setTreeDepth] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const [count, setCount] = useState(0);
  const [prop, setProp] = useState(0);

  const onUpdateBranchingFactor = (event) => {
    setBranchingFactor(parseInt(event.target.value, 10));
  };

  const onUpdateTreeDepth = (event) => {
    setTreeDepth(parseInt(event.target.value, 10));
  };

  const generate = () => {
    setInitialized(true);
  };

  const increment = () => {
    setCount(count + 1);
  };

  const updateTree = () => {
    setProp(prop + 1);
  };

  return (
    <div>
      <label>Select branching factor</label>
      <input
        id="input-branching-factor"
        type="number"
        onChange={onUpdateBranchingFactor}
      />
      <label>tree depth</label>
      <input id="input-tree-depth" type="number" onChange={onUpdateTreeDepth} />
      <button id="btn-generate" onClick={generate}>
        Generate tree
      </button>
      <div>{count}</div>
      <button id="btn-increment-root" onClick={increment}>
        Update root
      </button>
      <button id="btn-update-tree" onClick={updateTree}>
        Update entire tree
      </button>
      {initialized
        ? [...Array(branchingFactor)].map((_, i) => (
            <div key={i}>
              <Node
                branchingFactor={branchingFactor}
                subtreeDepth={treeDepth - 1}
                prop={prop}
              />
            </div>
          ))
        : null}
    </div>
  );
}
