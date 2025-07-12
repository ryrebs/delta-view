import React from "react";

const TableContext = React.createContext();

export { TableContext };

export default ({ children }) => {
  const [tableInfos, setTableInfos] = React.useState([]);

  const addTableInfo = (tblInfo) => {
    setTableInfos((t) => {
      for (let tbl of t) {
        if (tbl.active) {
          tbl.active = false;
        }
      }
      return [...t, tblInfo];
    });
  };

  const setActiveTable = (tblName) => {
    setTableInfos((t) => {
      for (let tbl of t) {
        if (tbl.name === tblName) {
          tbl.active = true;
        } else {
          tbl.active = false;
        }
      }
      return [...t];
    });
  };

  return (
    <TableContext.Provider
      value={{
        tableInfos,
        addTableInfo,
        setActiveTable,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};
