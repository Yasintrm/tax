import { createSlice } from "@reduxjs/toolkit";
import { parseCsvData, filterTableData } from "./Helper";

//redux toolkit

const initialState = {
    magazines: {
        isLoading: false,
        error: undefined,
        data: {}
    },
    books: {
        isLoading: false,
        error: undefined,
        data: {}
    },
    authors: {
        isLoading: false,
        error: undefined,
        data: {}
    },
    filtered: {
        type: undefined,
        magazines: { data: {} },
        books: { data: {} },
        authors: { data: {} }
    }
};

const csvTableSlice = createSlice({
    name: "csvTable",
    initialState,
    reducers: {
        fetchData(state, action) {
            const { name } = action.payload;
            if (state[name]) {
                state[name].isLoading = true;
            }

        },
        fetchDataSuccess(state, action) {
            const { name, data } = action.payload;
            if (state[name]) {
                state[name].isLoading = false;
                state[name].error = "";
                state[name].data = parseCsvData(data);
            }

        },
        fetchDataError(state, action) {
            const { name, error } = action.payload;
            if (state[name]) {
                state[name].isLoading = false;
                state[name].error = error.toString();
            }
        },
        search(state, action) {

            const { type, value } = action.payload;
            state.filtered.type = type;

            if (type === "isbn") {
                state.filtered.books.data = filterTableData("isbn", state.books.data, value);
                state.filtered.magazines.data = filterTableData("isbn", state.magazines.data, value);


                //filter authors whose books includes isbn 
                const filteredAuthors = [
                    ...(state.filtered.books.data.rows || []).map(x => (x["authors"] || "").split(",")),
                    ...(state.filtered.magazines.data.rows || []).map(x => (x["authors"] || "").split(","))
                ].flat();

                const uniqueAuthorList = [...new Set(filteredAuthors)];
                state.filtered.authors.data = { ...state.authors.data };
                state.filtered.authors.data.rows = state.authors.data.rows.filter(x => uniqueAuthorList.includes(x["email"]));

            } else if (type === "email") {
                state.filtered.authors.data = filterTableData("email", state.authors.data, value);
                state.filtered.books.data = filterTableData("authors", state.books.data, value);
                state.filtered.magazines.data = filterTableData("authors", state.magazines.data, value);
            }
        },
        clearSearch(state) {
            state.filtered.type = undefined;
        }
    }
});


export default csvTableSlice.reducer;

export const csvActions = {
    ...csvTableSlice.actions,
    fetchCsvTableAsync(dispatch, tableName) {
        dispatch(csvActions.fetchData({ name: tableName }));

        fetch(`${tableName}.csv`).then((data) => data.text()).then(jsonData => {
            
            //simulate delay with setTimeout
            setTimeout(() => {
                dispatch(csvActions.fetchDataSuccess({ name: tableName, data: jsonData }));
            }, 500);

        }).catch(err => {
            dispatch(csvActions.fetchDataError({ name: tableName, error: err.message || err.toString() }));
        });

    }
};