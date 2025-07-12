package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"strings"
)

const ROW_LIMIT = 1000

// App struct
type App struct {
	ctx        context.Context
	db         *sql.DB
	tableInfos []TableInfo
}

func (a *App) addTableInfo(tblInfo TableInfo) {
	a.tableInfos = append(a.tableInfos, tblInfo)
}

func (a *App) getTableInfo(tblPath string) *TableInfo {
	for _, tbl := range a.tableInfos {
		if tbl.TblPath == tblPath {
			return &tbl
		}
	}
	return nil
}

// NewApp creates a new App application struct
func NewApp(db *sql.DB) *App {
	return &App{db: db}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

type TblDescribe struct {
	column_name any
	column_type any
	nl          any
	key         any
	extra       any
	default_    any
}

type TableInfo struct {
	Name          string `json:"name"`
	TblPath       string `json:"tblPath"`
	Rows          []any  `json:"rows"`
	NumRows       int    `json:"numRows"`
	CurrentOffset int    `json:"currOffset"`
	ErrMsg        string `json:"errMsg"`
}

func GetTblDescription(db_ *sql.DB, tblPath string, rowOffset int) ([]TblDescribe, string) {
	tblCols := make([]TblDescribe, 0)
	queryStr := fmt.Sprintf("DESCRIBE SELECT * FROM delta_scan('%s') OFFSET %d LIMIT %d", tblPath, rowOffset, ROW_LIMIT)
	rows, err := db_.Query(queryStr)

	if err != nil {
		if strings.Contains(err.Error(), "InvalidTableLocation") {
			return nil, "Invalid table location"
		} else {
			log.Println(err.Error())
			return nil, "Failed to load table path"
		}
	}
	for rows.Next() {
		var col, tp, ky, xt, df any
		var nl any

		if err := rows.Scan(&col, &tp, &nl, &ky, &xt, &df); err != nil {
			log.Fatal(err)
		}
		tblCols = append(tblCols, TblDescribe{col, tp, &nl, ky, xt, df})
	}
	return tblCols, ""
}

func (a *App) GetRowsFromTbl(tblPath string) TableInfo {

	rowcols := make([]any, 0)

	tblInfo := &TableInfo{
		TblPath: tblPath,
	}

	// Get table structure
	cols, errMsg := GetTblDescription(a.db, tblPath, 0)

	if errMsg != "" {
		return TableInfo{ErrMsg: errMsg}
	}

	coln := make([]string, 0)
	for _, v := range cols {
		coln = append(coln, v.column_name.(string))
	}
	rowcols = append(rowcols, coln)

	// Get rows
	query := fmt.Sprintf("SELECT * FROM delta_scan('%s') LIMIT 1000", tblPath)
	rows, err := a.db.Query(query)
	if err != nil {
		return TableInfo{ErrMsg: err.Error()}
	}

	tblName_ := strings.Split(tblPath, "/")
	tblInfo.Name = tblName_[len(tblName_)-2]

	for rows.Next() {
		valuesP := make([]any, 0)
		for range len(coln) {
			rv := new(any)
			valuesP = append(valuesP, rv)
		}

		if err := rows.Scan(valuesP...); err != nil {
			log.Fatal(err)
		}

		derefValuesP := []any{}
		for _, v := range valuesP {
			derefValuesP = append(derefValuesP, *v.(*any))
		}
		rowcols = append(rowcols, derefValuesP)
	}

	// First index contains the column names
	// Second index contains row values
	tblInfo.Rows = rowcols
	return *tblInfo
}
