/* eslint-disable react/prop-types */
import { useState } from "react";

import Cell from "./Cell";

const Row = ({ columns }) => {
  const [count, setCount] = useState(0);
  const [offset, setOffset] = useState(0);

  const onInput = () => setCount(count + 1);

  const updateRow = () => setOffset(offset + 1);

  return (
    <div>
      <div>
        Row count: {count}
        <button className="row-btn-update-children" onClick={updateRow}>
          + children
        </button>
        <button className="row-btn-update-self" onClick={onInput}>
          + parent
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "row", columnGap: 10 }}>
        {columns.map((column, i) => (
          <Cell key={column.id} value={i + offset} />
        ))}
      </div>
    </div>
  );
};

export default Row;
