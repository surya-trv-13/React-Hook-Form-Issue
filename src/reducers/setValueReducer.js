import { SET_DATA } from "../actions/actionTypes";

const initialState = {
  data: {}
};

const setValueReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_DATA:
      return { ...state, data: { ...state.data, ...action.payload } };
    default:
      return state;
  }
};

export default setValueReducer;
