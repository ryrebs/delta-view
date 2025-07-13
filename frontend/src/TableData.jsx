import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";

import { TableContext } from "./ctx";

export default () => {
  const { activeTable } = React.useContext(TableContext);
  const [rows, setRows] = useState([]);
  const [cols, setCols] = useState([]);
  const [name, setName] = useState("");

  React.useEffect(() => {
    if (activeTable) {
      setRows(activeTable.rows);
      setCols(activeTable.cols);
      setName(activeTable.name);
    }
  }, [activeTable && activeTable.name]);

  const getOrSetRowID = (row) => {
    if (row.id === null) {
      return crypto.randomUUID();
    }
    return row.id;
  };

  return (
    <Grid size={10}>
      <DataGrid
        label={name}
        rows={rows}
        columns={cols}
        showToolbar
        getRowId={getOrSetRowID}
      />
    </Grid>
  );
};
