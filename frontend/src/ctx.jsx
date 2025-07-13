import React from "react";

const TableContext = React.createContext();

export { TableContext };

export default ({ children }) => {
  const [tableNames, setTableNames] = React.useState({});
  const [activeTable, setActiveTableName] = React.useState();

  const addTable = (name, path) => {
    setTableNames((t) => {
      if (!Object.keys(t).includes(name)) {
        return { ...t, ...{ [name]: path } };
      }
      return t;
    });
  };

  const setActiveTable = (tblInfo) => {
    setActiveTableName(tblInfo);
  };

  return (
    <TableContext.Provider
      value={{
        tableNames,
        addTable,
        setActiveTable,
        activeTable,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};
