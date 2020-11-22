import React, { useState } from "react";
import "./Page.css";
import CsvTable from "../csvTable/CsvTable.jsx";
import { useDispatch } from "react-redux";
import { csvActions } from "../csvTable/csvTableSlice";

const Page = () => {
    const [searchKey, setSearchKey] = useState("");
    const [searchType, setSearchType] = useState("");
    const dispatch = useDispatch();

    const handleFilterTypeChange = (val) => {
        setSearchType(val);
    };

    const handleSearchKeyChange = (event) => {
        const val = event.target.value;
        setSearchKey(val);
    };

    const handleSearch = () => {
        const key = (searchKey || "").trim();
        if (key) {
            dispatch(csvActions.search({ type: searchType, value: key }));
        }
        
    };

    const handleClear = () => {
        setSearchType("");
        setSearchKey("");
        dispatch(csvActions.clearSearch());
    };

    return (
        <React.Fragment>
            <fieldset className="container">
                <legend>Search Panel</legend>

                <div className="child search">
                    <div>
                        <label>
                            <input name="filter"
                                type="radio"
                                onChange={() => handleFilterTypeChange("isbn")}
                                checked={searchType === "isbn"} ></input>Isbn
                        </label>
                        <label>
                            <input name="filter"
                                onChange={() => handleFilterTypeChange("email")}
                                type="radio"
                                checked={searchType === "email"}
                                value={searchType}></input>Email
                        </label>
                        <label>
                            <input name="filter"
                                disabled={searchType === ""}
                                type="text"
                                className="searchinput"
                                placeholder="Type to search"
                                onChange={handleSearchKeyChange}
                                value={searchKey}>
                            </input>
                        </label>
                        <button onClick={handleSearch}> Search </button>
                        <button onClick={handleClear}> Clear Filters </button>
                    </div>

                </div>

            </fieldset>
            <div>
                <CsvTable tableName="authors" />
                <CsvTable tableName="books" />
                <CsvTable tableName="magazines" />
            </div>
        </React.Fragment>
    )
};

//cache
export default React.memo(Page);