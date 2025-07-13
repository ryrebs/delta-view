import "./App.css";
import { GetRowsFromTbl, RemoveTable } from "../wailsjs/go/main/App";
import React, { useState } from "react";
import { GridAddIcon, GridDeleteIcon } from "@mui/x-data-grid";
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

import { TableContext } from "./ctx";

const textColor = "#343232";
const iconColorPrim = "#817e7e";
const textWarningColor = "#a31545";
const iconColorActive = "rgba(4, 128, 12, 1)";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  minWidth: 450,
  transform: "translate(-50%, -50%)",
  p: 4,
};

const StyledTableIcon = styled(FontAwesomeIcon)({
  padding: "10px",
  cursor: "pointer",
  fontSize: "18px",
});

export default () => {
  const { addTable, tableNames, activeTable, setActiveTable, removeTableName } =
    React.useContext(TableContext);
  const [err, setErr] = useState("");
  const [tblPath, setTblPath] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const loadTableFromPath = async (tp) => {
    const tblInfo = {
      rows: [],
      cols: [],
      name: "",
    };
    const tbp = tp === null || tp === undefined ? tblPath : tp;
    try {
      if (tbp) {
        const data = await GetRowsFromTbl(tbp);
        const { rows, errMsg, name } = data;
        if (errMsg !== "") {
          setErr(errMsg);
        } else {
          // Get col names
          const dtCols = [];
          const dtColsKeys = [];
          for (let cl of rows[0]) {
            dtCols.push({ field: cl, headerName: cl, width: 150 });
            dtColsKeys.push(cl);
          }
          tblInfo.cols = dtCols;

          // Get rows
          const dtRows = [];
          for (let cl of rows.slice(1)) {
            const dtRow = {};
            dtRow["id"] = cl[0];
            for (let i = 0; i < dtColsKeys.length; i++) {
              dtRow[dtColsKeys[i]] = cl[i];
            }
            dtRows.push(dtRow);
          }
          tblInfo.rows = dtRows;
          tblInfo.name = name;
          setActiveTable(tblInfo);
          addTable(name, tbp);
          setErr("");
          handleClose();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadTableFromPathCB = React.useCallback(
    (pt) => loadTableFromPath(pt),
    [tblPath]
  );

  const loadInactive = (tblName) => {
    if (tblName && tableNames[tblName]) {
      const pt = tableNames[tblName];
      setTblPath(pt);
      loadTableFromPathCB(pt);
    }
  };

  const removeTable = async (tblName) => {
    const removed = await RemoveTable(tblName);
    if (removed > 0) {
      removeTableName(tblName);
    }
  };

  return (
    <>
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
          {tableNames &&
            Object.keys(tableNames).map((tbl) => (
              <ListItem
                sx={{
                  minWidth: "250px",
                  justifyContent: "space-between",
                  columnGap: "10px",
                }}
              >
                <>
                  <StyledTableIcon
                    icon={faTable}
                    color={
                      tbl === activeTable.name ? iconColorActive : iconColorPrim
                    }
                    onClick={() =>
                      activeTable.name !== tbl && loadInactive(tbl)
                    }
                  />
                  <ListItemText
                    sx={{
                      color: textColor,
                    }}
                    primary={tbl}
                  />
                </>
                {activeTable.name !== tbl && (
                  <IconButton edge="end" aria-label="delete">
                    <GridDeleteIcon
                      sx={{
                        color: textWarningColor,
                        marginLeft: "1rem",
                        fontSize: "16px",
                      }}
                      onClick={() => removeTable(tbl)}
                    />
                  </IconButton>
                )}
              </ListItem>
            ))}
        </List>
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
              marginBottom: "8px",
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
              value={tblPath}
              onChange={(e) => {
                setTblPath(e.target.value);
              }}
            />
            <Button
              sx={{
                textTransform: "none",
                color: textColor,
              }}
              onClick={() => loadTableFromPathCB()}
            >
              Open
            </Button>
          </Box>
        </Paper>
      </Modal>
    </>
  );
};
