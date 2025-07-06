package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
)

// App struct
type App struct {
	ctx context.Context
	db  *sql.DB
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

func GetTblDescription(db_ *sql.DB, tblPath string) []TblDescribe {
	tblCols := make([]TblDescribe, 0)
	queryStr := fmt.Sprintf("DESCRIBE SELECT * FROM delta_scan('%s')", tblPath)
	rows, err := db_.Query(queryStr)
	if err != nil {
		log.Fatal(err)
	}
	for rows.Next() {
		var col, tp, ky, xt, df any
		var nl any

		if err := rows.Scan(&col, &tp, &nl, &ky, &xt, &df); err != nil {
			log.Fatal(err)
		}
		tblCols = append(tblCols, TblDescribe{col, tp, &nl, ky, xt, df})
	}
	return tblCols
}

func (a *App) GetRowsFromTbl(tblPath string) []any {

	rowcols := make([]any, 0)

	// Get table structure
	cols := GetTblDescription(a.db, tblPath)

	coln := make([]string, 0)
	for _, v := range cols {
		coln = append(coln, v.column_name.(string))
	}
	rowcols = append(rowcols, coln)

	// Get rows
	query := fmt.Sprintf("SELECT * FROM delta_scan('%s') LIMIT 1000", tblPath)
	rows, err := a.db.Query(query)
	if err != nil {
		log.Fatal(err)
	}

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
	return rowcols
}
