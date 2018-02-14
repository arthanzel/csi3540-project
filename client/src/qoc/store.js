import { createStore } from "redux";

import * as examples from "./examples";
import rootReducer from "reducers";

/*
    State schema:
    ====================

    EQUATION: { symbol: String(1..2), expression: String, id: Integer }

    {
        equations: [
            EQUATION
            ...
        ],
        parameters: [
            EQUATION,
            ...
        ],
        resolution: Integer,
        time: Decimal
    }
 */

let initialState = {
    equations: [],
    parameters: []
};
initialState = Object.assign(initialState, examples.sir);

const store = createStore(rootReducer,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export default store;

// Observable-style function to subscribe to state changes
export const listen = function(listener) {
    return store.subscribe(() => {
        listener(store.getState());
    });
};