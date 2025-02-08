import { useState } from "react";

import Child from "./Child.jsx";
import Child2 from "./Child2.jsx";

const Scenario1 = () => {
  const [numChildren, setNumChildren] = useState(0);
  const [children, setChildren] = useState([]);
  const [staticElements, setStaticElements] = useState([]);
  const [childType, setChildType] = useState(1);

  const addOne = () => setChildren([...children, { id: children.length }]);

  const remove = () => setChildren([]);

  const generateDynamic = () =>
    setChildren(new Array(numChildren).fill(null).map((_, i) => ({ id: i })));

  const generateStatic = () =>
    setStaticElements(new Array(numChildren).fill(null));

  const onUpdateValue = (event) =>
    setNumChildren(parseInt(event.target.value, 10));

  const switchType = () => setChildType(childType == 1 ? 2 : 1);

  return (
    <>
      <div>
        <div>
          <label>Number of components or elements to create</label>
          <input
            id="input-num-to-create"
            type="number"
            min="1"
            onChange={onUpdateValue}
          />
          <button id="btn-generate-components" onClick={generateDynamic}>
            Generate components
          </button>
          <button id="btn-generate-elements" onClick={generateStatic}>
            Generate static elements
          </button>
        </div>
        <div>
          <button id="btn-delete" onClick={remove}>
            Delete all components
          </button>
          <button id="btn-add-one" onClick={addOne}>
            Add one component
          </button>
          <button id="btn-switch-child-type" onClick={switchType}>
            Change child component type
          </button>
        </div>
      </div>
      <div id="content">
        {children.map((item) =>
          childType === 1 ? (
            <Child key={item.id} />
          ) : (
            <Child2 key={item.id} id={item.id} />
          )
        )}
        {staticElements.map((_, i) => (
          <div key={i}>static</div>
        ))}
      </div>
    </>
  );
};

export default Scenario1;
