import { combineReducers } from "redux";

import stepReducer from "./stepReducers";
import setValueReducer from "./setValueReducer";

export const rootReducer = combineReducers({
  stepReducer,
  setValueReducer
});
