import { combineReducers } from "redux";
import { ordersReducer } from "./orders.reducer.js";
import authReducer from "./authReducer.js";

const rootReducer = combineReducers({
  orders: ordersReducer,
  auth: authReducer,
});

export default rootReducer;
