
//Helper functions for data manipulation
export function parseCsvData(data) {
    if (!data) {
        return undefined;
    }

    var table = { columns: undefined, rows: undefined };
    var arr = data.split("\n").filter(x => x.trim());

    table.columns = arr[0].split(";").map(x => x.trim());

    if (!table.columns.length) {
        return undefined;
    }

    if (arr.length > 1) {
        table.rows = [];
        for (let i = 1, l = arr.length; i < l; i++) {
            const rowData = arr[i].split(";").map(x => x.trim());
            
            if (rowData.length){
                const rowObj = {};
                table.columns.forEach((colName, index) => {
                    rowObj[colName] = rowData[index];
                });

                table.rows.push(rowObj);
            }
        }
    }

    if (table.columns && table.rows) {
        //add id property to column and row
        table.columns = ["id", ...table.columns];
        table.rows = table.rows.sort((a, b) => (a.title || "").toLowerCase().localeCompare((b.title || "").toLowerCase())); 
        table.rows.forEach((data, index) => data.id = index + 1);
        return table;
    }

    return undefined;
}

export function filterTableData(field, data, searchKey) {
    if (!data || !data.rows) {
        return [];
    }
    

    const filteredRows = data.rows.filter(rowData => {
        const rowVal = (rowData[field] || "").toLowerCase().trim();
        const searchVal = (searchKey || "").toLowerCase().trim();
        return rowVal.includes(searchVal);
    });

    return {columns: [...data.columns], rows: [...filteredRows]};
}