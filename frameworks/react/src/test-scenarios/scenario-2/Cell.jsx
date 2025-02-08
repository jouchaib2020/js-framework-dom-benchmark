import { useState } from "react";
// eslint-disable-next-line react/prop-types
export default function Cell({ value }) {
  const [count, setCount] = useState(0);
  return (
    <span>
      outer: {value}
      <br />
      inner: {count}
      <button onClick={() => setCount(count + 1)}>+</button>
    </span>
  );
}
