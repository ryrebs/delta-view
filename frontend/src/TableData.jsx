import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";

import { TableContext } from "./ctx";

export default () => {
  const { tableInfos } = React.useContext(TableContext);
  const [rows, setRows] = useState([]);
  const [cols, setCols] = useState([]);
  const [name, setName] = useState("");

  React.useEffect(() => {
    tableInfos.forEach((tbl) => {
      if (tbl.active) {
        setRows(tbl.rows);
        setCols(tbl.cols);
        setName(tbl.name);
      }
    });
  }, [tableInfos]);

  return (
    <Grid size={10}>
      <DataGrid label={name} rows={rows} columns={cols} showToolbar />
    </Grid>
  );
};
