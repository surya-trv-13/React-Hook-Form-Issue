import React from "react";
import { connect } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { data } from "../data.js";
import { TextField, FormControl, Button } from "@material-ui/core";
import { updateStep, previousStep } from "../actions/stepAction";

const CreateForm = ({ activeStep, updateStep, previousStep }) => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: "all"
  });

  const onSubmit = (data) => {
    console.log(data);
    updateStep();
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {data &&
          data[activeStep].map((formField, index) => {
            if (formField.type === "TextField") {
              return (
                <Controller
                  key={index}
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
          <Button variant="contained" onClick={previousStep}>
            PREVIOUS
          </Button>
          <Button variant="contained" type="submit">
            NEXT
          </Button>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  activeStep: state.stepReducer.activeStep
});

const mapDispatchToProps = (dispatch) => ({
  updateStep: () => dispatch(updateStep()),
  previousStep: () => dispatch(previousStep())
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateForm);
