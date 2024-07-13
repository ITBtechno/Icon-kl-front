import { createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import rootReducer from "../reducers/rootReducer";

const globalState = createStore(rootReducer, applyMiddleware(thunk));

export default globalState;
