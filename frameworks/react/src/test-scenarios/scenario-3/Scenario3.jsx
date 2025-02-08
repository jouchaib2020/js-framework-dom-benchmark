import { useState } from "react";

import StaticNode from "./Node2";
import DynamicNode from "./Node";

const Scenario3 = () => {
  const [branchingFactor, setBranchingFactor] = useState(0);
  const [treeDepth, setTreeDepth] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const [count, setCount] = useState(0);
  const [nodeType, setNodeType] = useState(1);

  const onUpdateBranchingFactor = (event) => {
    setBranchingFactor(parseInt(event.target.value, 10));
  };

  const onUpdateTreeDepth = (event) => {
    setTreeDepth(parseInt(event.target.value, 10));
  };

  const generate = () => {
    setInitialized(true);
  };

  const generateSimple = () => {
    setNodeType(2);
    setInitialized(true);
  };

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <label>branching factor</label>
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
      <button id="btn-generate-simple" onClick={generateSimple}>
        Generate static tree
      </button>
      <div>{count}</div>
      <button id="btn-increment-root" onClick={increment}>
        + root
      </button>
      {initialized &&
        [...Array(branchingFactor)].map((_, i) => (
          <div key={i}>
            {nodeType === 1 ? (
              <DynamicNode
                key={i}
                branchingFactor={branchingFactor}
                subtreeDepth={treeDepth - 1}
              />
            ) : (
              <StaticNode
                key={i}
                branchingFactor={branchingFactor}
                subtreeDepth={treeDepth - 1}
              />
            )}
          </div>
        ))}
    </div>
  );
};

export default Scenario3;
