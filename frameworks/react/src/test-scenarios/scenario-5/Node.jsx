/* eslint-disable react/prop-types */
import { useState } from "react";

export default function Node({ subtreeDepth, branchingFactor, prop }) {
  const [count, setCount] = useState(0);

  return (
    <div>
      {prop}
      <div>
        {count}
        <button
          className="btn-increment-node"
          onClick={() => setCount(count + 1)}
        >
          +
        </button>
      </div>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      <span>-</span>
      {subtreeDepth > 0
        ? [...Array(branchingFactor)].map((_, i) => (
            <Node
              key={i}
              branchingFactor={branchingFactor}
              subtreeDepth={subtreeDepth - 1}
              prop={prop}
            />
          ))
        : null}
    </div>
  );
}
