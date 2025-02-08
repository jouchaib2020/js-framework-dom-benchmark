import { useState } from "react";

import Child from "./Child";

export default function Scenario4() {
  const [numChildren, setNumChildren] = useState(0);
  const [children, setChildren] = useState([]);

  const generate = () => {
    setChildren(
      new Array(numChildren).fill(null).map((_, i) => ({ id: i, value: i }))
    );
  };

  const update = () => {
    setChildren(
      children.map((child) => ({
        ...child,
        value: child.value + 1,
      }))
    );
  };

  const updateRandomChild = () => {
    if (children.length === 0) return;

    const i = Math.floor(Math.random() * children.length);

    // Create a *new* array with the updated child.  This is crucial!
    const updatedChildren = [...children]; // Create a copy
    updatedChildren[i] = {
      ...updatedChildren[i],
      value: updatedChildren[i].value + 1,
    };
    setChildren(updatedChildren); // Set the state with the new array
  };

  const onChange = (event) => {
    setNumChildren(parseInt(event.target.value, 10));
  };

  return (
    <div>
      <div>
        <label>Number of components</label>
        <input
          id="input-components"
          type="number"
          min="1"
          onChange={onChange}
        />
        <button id="btn-generate" onClick={generate}>
          Generate
        </button>
        <button id="btn-update" onClick={update}>
          Update children
        </button>
        <button id="btn-update-single" onClick={updateRandomChild}>
          Update single child
        </button>
      </div>
      {children.map((child) => (
        <Child key={child.id} value={child.value} />
      ))}
    </div>
  );
}
