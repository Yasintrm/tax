/**
 * This is the entry point of the application.
 * You don't need to keep the current code, feel free to modify it.
 * Default output of this code is 'Hello world!' in console.
 */
//I used redux-toolkit for state management

import React from "react";
import App from './App';
import { render } from "react-dom";
import { Provider } from 'react-redux';
import store from "./../store/store";

const main = (
    <Provider store={store}>
        <App />
    </Provider>
);

render(main, document.getElementById("app"));

