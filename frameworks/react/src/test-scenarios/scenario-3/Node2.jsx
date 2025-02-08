/* eslint-disable react/prop-types */
export default function DynamicNode({ branchingFactor, subtreeDepth }) {
  return (
    <div>
      {subtreeDepth > 0
        ? [...Array(branchingFactor)].map((_, i) => (
            <DynamicNode
              key={i}
              branchingFactor={branchingFactor}
              subtreeDepth={subtreeDepth - 1}
            />
          ))
        : null}
      -
    </div>
  );
}
