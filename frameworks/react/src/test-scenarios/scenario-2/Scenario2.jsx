import { useState } from "react";
import Row from "./Row";

const Scenario2 = () => {
  const [numRows, setNumRows] = useState(10);
  const [numColumns, setNumColumns] = useState(10);
  const [rows, setRows] = useState([]);

  const updateRows = (value) => setNumRows(parseInt(value, 10));
  const updateColumns = (value) => setNumColumns(parseInt(value, 10));

  const generate = () => {
    setRows(
      new Array(numRows).fill(null).map((_, i) => ({
        id: i,
        columns: new Array(numColumns).fill(null).map((_, y) => ({
          id: `row${i}-col${y}`,
        })),
      }))
    );
  };

  return (
    <div>
      <div>
        <label>Number of rows</label>
        <input
          id="input-rows"
          type="number"
          min="1"
          value={numRows}
          onChange={(event) => updateRows(event.target.value)}
        />
        <label>Number of columns</label>
        <input
          id="input-columns"
          type="number"
          min="1"
          value={numColumns}
          onChange={(event) => updateColumns(event.target.value)}
        />
        <button id="btn-generate" onClick={generate}>
          Generate
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", rowGap: 20 }}>
        {rows.map((row) => (
          <Row key={row.id} columns={row.columns} />
        ))}
      </div>
    </div>
  );
};

export default Scenario2;
