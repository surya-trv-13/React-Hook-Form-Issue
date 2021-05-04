import { UPDATE_STEP, PREVIOUS_STEP } from "../actions/actionTypes";

const initialState = {
  activeStep: 0
};

const stepReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case UPDATE_STEP:
      return { activeStep: (state.activeStep + 1) % 2 };
    case PREVIOUS_STEP:
      return { activeStep: state.activeStep > 0 ? state.activeStep - 1 : 0 };
    default:
      return state;
  }
};

export default stepReducer;
