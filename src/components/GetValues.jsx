import { Typography, Button } from "@material-ui/core";
import { connect } from "react-redux";
import React from "react";
import { setValue } from "../actions/setValue";

const GetValues = ({ formValues, enteredData, setFormValue }) => {
  const handleSubmit = () => {
    console.log("Form Values:", formValues);
    setFormValue(formValues);
    setTimeout(() => {
      console.log("Data Submit", enteredData);
    }, 5000);
  };

  return (
    <div>
      <Typography>Values is</Typography>
      <Button onClick={handleSubmit} variant="outlined">
        Add
      </Button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  // activeStep: state.stepReducer.activeStep,
  enteredData: state.setValueReducer.data
});

const mapDispatchToProps = (dispatch) => ({
  // updateStep: () => dispatch(updateStep()),
  // previousStep: () => dispatch(previousStep()),
  setFormValue: (data) => dispatch(setValue(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(GetValues);
