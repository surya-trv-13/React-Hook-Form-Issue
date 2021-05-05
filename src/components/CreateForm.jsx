import React from "react";
import { connect } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { data } from "../data.js";
import { TextField, FormControl, Button } from "@material-ui/core";
import { updateStep, previousStep } from "../actions/stepAction";
import { setValue } from "../actions/setValue";
const CreateForm = ({
  activeStep,
  updateStep,
  previousStep,
  setValue,
  enteredData
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    mode: "all",
    shouldUnregister: true
  });

  const onSubmit = (data) => {
    console.log(data);
    updateStep();
    setValue(data);
  };

  const handlePreviousStep = () => {
    previousStep();
    reset(enteredData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {data &&
          data[activeStep].map((formField, index) => {
            if (formField.type === "TextField") {
              return (
                <Controller
                  key={index + formField.name}
                  control={control}
                  name={formField.name}
                  render={({ field: { ref, ...inputProps } }) => (
                    <FormControl variant="outlined">
                      <TextField
                        {...inputProps}
                        variant="outlined"
                        label={formField.label}
                        required={formField?.isMandatory}
                        InputLabelProps={{
                          shrink: true
                        }}
                        inputRef={ref}
                        error={errors?.[formField.name]}
                        helperText={
                          errors?.[formField.name] &&
                          errors?.[formField.name].message
                        }
                        InputProps={{
                          autoComplete: "off"
                        }}
                      />
                    </FormControl>
                  )}
                />
              );
            } else {
              return null;
            }
          })}
        <div>
          <Button variant="contained" onClick={handlePreviousStep}>
            PREVIOUS
          </Button>
          <Button variant="contained" type="submit">
            NEXT
          </Button>
        </div>
      </form>
      <pre>{JSON.stringify(enteredData, null, 2)}</pre>
    </div>
  );
};

const mapStateToProps = (state) => ({
  activeStep: state.stepReducer.activeStep,
  enteredData: state.setValueReducer.data
});

const mapDispatchToProps = (dispatch) => ({
  updateStep: () => dispatch(updateStep()),
  previousStep: () => dispatch(previousStep()),
  setValue: (data) => dispatch(setValue(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateForm);
