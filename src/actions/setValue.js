import { SET_DATA } from "./actionTypes";

export const setValue = (data) => ({
  type: SET_DATA,
  payload: data
});
