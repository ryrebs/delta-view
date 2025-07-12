import "./App.css";
import React from "react";

import Grid from "@mui/material/Grid";
import styled from "@mui/styled-engine";

import TableContextProvider from "./ctx";
import TablePanel from "./TablePanel";
import TableData from "./TableData";

const StyledGridContainer = styled(Grid)(() => ({
  justifyContent: "center",
  alignItems: "center",
  minWidth: "1000px",
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  minWidth: 450,
  transform: "translate(-50%, -50%)",
  p: 4,
};

function App() {
  return (
    <div id="App">
      <TableContextProvider>
        <StyledGridContainer container spacing={2}>
          <Grid
            size={12}
            columnGap={1}
            rowSpacing={1}
            sx={{
              height: "80vh",
              display: "flex",
            }}
          >
            <TableData />
            <TablePanel />
          </Grid>
          <Grid>
            <h1>Query</h1>
          </Grid>
        </StyledGridContainer>
      </TableContextProvider>
    </div>
  );
}

export default App;
