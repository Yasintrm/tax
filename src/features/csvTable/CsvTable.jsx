import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { csvActions } from "./csvTableSlice";
import "./CsvTable.css";

const CsvTable = (prop) => {
  const dispatch = useDispatch();

  const state = useSelector(rootState => {
    const csv = rootState.csv;
    const isFiltered = !!csv.filtered.type
    return isFiltered ? csv.filtered[prop.tableName] : csv[prop.tableName];
  });

  useEffect(() => {
    csvActions.fetchCsvTableAsync(dispatch, prop.tableName);
  }, [dispatch]);

  if (state.isLoading) {
    return (
      <div className="message">
        {prop.tableName} loading..
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="message">
        Unable to fetch data for {prop.tableName} error:{state.error}
      </div>
    );
  }

  const { columns, rows } = state.data;

  if (!Array.isArray(columns) || !Array.isArray(rows)) {
    return (
      <div className="message">
        Could not generate data for selected csv table
      </div>
    );
  }

  return (
    <React.Fragment>

      <fieldset>
        <legend>{prop.tableName}</legend>

        <table className={`table ${prop.tableName}`}>
          <thead>
            <tr>
              {
                columns.map(column => <th key={column}>{column}</th>)
              }
            </tr>
          </thead>
          <tbody>
            {rows.map(rowData => {
              return <tr key={rowData.id}>
                {
                  columns.map(colName => {
                    return (<td key={rowData.id + "-" + colName}>
                      {rowData[colName]}
                    </td>);
                  })
                }
              </tr>
            })}
          </tbody>
          <tfoot>
            <th className="recordcount" colSpan={columns.length}>
              Record count: {rows.length}
            </th>
          </tfoot>
        </table>
      </fieldset>
    </React.Fragment>
  );
};

//cache
export default React.memo(CsvTable);