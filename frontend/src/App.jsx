import "./App.css";
import { GetRowsFromTbl } from "../wailsjs/go/main/App";
import React, { useState } from "react";
import { DataGrid, GridAddIcon, GridDeleteIcon } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import styled from "@mui/styled-engine";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import StorageSharpIcon from "@mui/icons-material/StorageSharp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable } from "@fortawesome/free-solid-svg-icons";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";

// import DeleteIcon from '@mui/icons-material/Delete';

const textColor = "#343232";
const iconColorPrim = "#817e7e";
const textWarningColor = "#a31545";

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
  const [rows, setRows] = useState([]);
  const [cols, setCols] = useState([]);
  const [err, setErr] = useState("");
  const [tblName, setTbl] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function loadTbl() {
    if (tblName != "" && tblName != null) {
      GetRowsFromTbl(tblName)
        .then((v) => {
          const { tableRows, errMsg } = v;
          if (errMsg !== "") {
            setErr(errMsg);
            setRows([]);
            setCols([]);
          } else {
            // Get col names
            const dtCols = [];
            const dtColsKeys = [];
            for (let cl of tableRows[0]) {
              dtCols.push({ field: cl, headerName: cl, width: 150 });
              dtColsKeys.push(cl);
            }
            setCols(dtCols);

            // Get rows
            const dtRows = [];
            for (let cl of tableRows.slice(1)) {
              const dtRow = {};
              dtRow["id"] = cl[0];
              for (let i = 0; i < dtColsKeys.length; i++) {
                dtRow[dtColsKeys[i]] = cl[i];
              }
              dtRows.push(dtRow);
            }
            setRows(dtRows);
            setErr("");
          }
        })
        .catch((err) => {
          console.log(err);
          setCols([]);
          setRows([]);
        });
    }
  }

  return (
    <div id="App">
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
          <Grid size={10}>
            <DataGrid rows={rows} columns={cols} showToolbar />
          </Grid>
          <Grid
            size={2}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              minWidth: "310px",
              padding: "1rem",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <Button
                variant="text"
                startIcon={<StorageSharpIcon sx={{ color: iconColorPrim }} />}
                endIcon={<GridAddIcon sx={{ color: iconColorPrim }} />}
                sx={{
                  color: { textColor },
                  textTransform: "none",
                  textAlign: "center",
                }}
                onClick={handleOpen}
              >
                <Typography variant="subtitle1" color={textColor}>
                  Tables
                </Typography>
              </Button>
            </Box>
            <List
              dense
              sx={{
                height: "100%",
              }}
            >
              <ListItem
                sx={{
                  minWidth: "250px",
                  justifyContent: "flex-start",
                }}
              >
                <FontAwesomeIcon
                  icon={faTable}
                  color={iconColorPrim}
                  style={{
                    padding: "10px",
                  }}
                />

                <ListItemText
                  sx={{
                    color: textColor,
                  }}
                  primary="Single-line item"
                />

                <IconButton edge="end" aria-label="delete">
                  <GridDeleteIcon
                    sx={{
                      color: textWarningColor,
                      marginLef: "1rem",
                      fontSize: "16px",
                    }}
                  />
                </IconButton>
              </ListItem>
            </List>
          </Grid>
        </Grid>
        <Grid>
          <h1>Query</h1>
        </Grid>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-table-path"
          aria-describedby="modal-table-path"
        >
          <Paper sx={style}>
            <Box
              sx={{
                textAlign: "left",
              }}
            >
              <Typography color={textWarningColor} variant="p">
                {err}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
              }}
            >
              <TextField
                type="text"
                label="Delta table path or table folder path..."
                fullWidth
                value={tblName}
                onChange={(e) => {
                  setTbl(e.target.value);
                }}
              />
              <Button
                sx={{
                  textTransform: "none",
                  color: textColor,
                }}
                onClick={loadTbl}
              >
                Open
              </Button>
            </Box>
          </Paper>
        </Modal>
      </StyledGridContainer>
    </div>
  );
}

export default App;
