import "./App.css";
import { GetRowsFromTbl } from "../wailsjs/go/main/App";
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

function App() {
  const [rows, setRows] = useState([]);
  const [cols, setCols] = useState([]);
  const [tblName, setTbl] = useState("");

  function loadTbl() {
    if (tblName != "" && tblName != null) {
      GetRowsFromTbl(tblName).then((v) => {
        // Get col names
        const dtCols = [];
        const dtColsKeys = [];
        for (let cl of v[0]) {
          dtCols.push({ field: cl, headerName: cl, width: 150 });
          dtColsKeys.push(cl);
        }
        setCols(dtCols);

        const dtRows = [];
        for (let cl of v.slice(1)) {
          const dtRow = {};
          dtRow["id"] = cl[0];
          for (let i = 0; i < dtColsKeys.length; i++) {
            dtRow[dtColsKeys[i]] = cl[i];
          }
          dtRows.push(dtRow);
        }
        setRows(dtRows);
      });
    }
  }

  return (
    <div id="App">
      <input
        type="text"
        name="tblName"
        value={tblName}
        onChange={(e) => setTbl(e.target.value)}
      />
      <button onClick={loadTbl}>Load</button>
      <DataGrid rows={rows} columns={cols} />
    </div>
  );
}

export default App;
