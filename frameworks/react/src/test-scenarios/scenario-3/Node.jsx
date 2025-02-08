/* eslint-disable react/prop-types */
import { useState } from "react";

const Node = ({ branchingFactor, subtreeDepth }) => {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div>
      {subtreeDepth > 0 ? (
        [...Array(branchingFactor)].map((_, i) => (
          <Node
            key={i}
            branchingFactor={branchingFactor}
            subtreeDepth={subtreeDepth - 1}
          />
        ))
      ) : (
        <div>
          {count}
          <button className="btn-increment-leaf" onClick={increment}>
            +
          </button>
        </div>
      )}
    </div>
  );
};

export default Node;
