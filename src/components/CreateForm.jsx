import React, { useRef } from "react";
import { connect } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { data } from "../data.js";
import {
  TextField,
  FormControl,
  Button,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox
} from "@material-ui/core";
import { updateStep, previousStep } from "../actions/stepAction";
import { setValue } from "../actions/setValue";
const CreateForm = ({
  activeStep,
  updateStep,
  previousStep,
  setFormValue,
  enteredData
}) => {
  const defaultIds = [];
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue
  } = useForm({
    mode: "all",
    shouldUnregister: true
    // defaultValues: { item_ids: [{ Surya: true }] }
  });

  const onSubmit = (data) => {
    console.log(data);
    updateStep();
    setFormValue(data);
  };

  const handleFileClick = useRef(null);

  const handlePreviousStep = () => {
    previousStep();
    reset(enteredData);
    console.log("DATA ENTERED", enteredData);
  };
  const handleFileInput = (event, name) => {
    console.log("Called File", event?.target?.files[0]);
    if (event.target.files) {
      setValue(name, event.target.files[0]);
    }
  };

  const onAttachClick = () => {
    handleFileClick.current.click();
  };

  const handleCheck = (checkedId) => {
    const { item_ids: ids } = getValues();
    console.log("GET VALUE", getValues());
    const newIds = ids?.includes(checkedId)
      ? ids?.filter((id) => id !== checkedId)
      : [...(ids ?? []), checkedId];
    console.log("GET VALUE", newIds);
    return newIds;
  };

  const handleFile = (e, name) => {
    e.preventDefault();

    return (
      <input
        type="type"
        ref={handleFileClick}
        onClick={(event) => {
          event.target.value = null;
        }}
        onChange={(event) => handleFileInput(event, name)}
      />
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {console.log("Data:: ", getValues())}
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
            } else if (formField.type === "File") {
              return (
                <Controller
                  key={index + formField.name}
                  control={control}
                  name={formField.name}
                  render={({ field: { ref, ...inputProps } }) => (
                    <FormControl variant="outlined">
                      <TextField
                        {...inputProps}
                        onChange={(e) => handleFileInput(e, formField.name)}
                        variant="outlined"
                        label={formField.label}
                        required={formField?.isMandatory}
                        InputLabelProps={{
                          shrink: true
                        }}
                        value={getValues()?.[formField.name]?.name}
                        inputRef={ref}
                        error={errors?.[formField.name]}
                        helperText={
                          errors?.[formField.name] &&
                          errors?.[formField.name].message
                        }
                        InputProps={{
                          autoComplete: "off",
                          readOnly: true
                        }}
                      />
                      <Button variant="contained" component="label">
                        Upload File
                        <input
                          type="file"
                          hidden
                          onChange={(e) => handleFileInput(e, formField.name)}
                        />
                      </Button>
                    </FormControl>
                  )}
                />
              );
            } else if (formField.type === "checkbox") {
              return (
                <FormControl error={!!errors.item_ids?.message}>
                  <Controller
                    name="item_ids"
                    render={({ field }) => {
                      // console.log("Item", field.value[0]?.["Surya"]);
                      return formField.content.map((item, index) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              onChange={() =>
                                field.onChange(handleCheck(item.name))
                              }
                              defaultChecked={enteredData.item_ids?.includes(
                                item.name
                              )}
                              // defaultChecked={defaultIds.includes(item.name)}
                            />
                          }
                          key={index}
                          label={item.name}
                        />
                      ));
                    }}
                    control={control}
                  />
                </FormControl>
                // // <FormControl component="fieldset">
                // //   <FormLabel component="legend">
                // //     Assign responsibility
                // //   </FormLabel>
                // //   <FormGroup>
                // <>
                //   {formField.content.map((con, keyName) => (
                //     <Controller
                //       key={keyName}
                //       control={control}
                //       name={con.name}
                //       valueName="checked"
                //       type="checkbox"
                //       render={(field) => (
                //         <FormControlLabel
                //           {...field}
                //           control={<Checkbox value={con.name} />}
                //           label={con.optionValue}
                //           onChange={(e) =>
                //             console.log("VALUE::: ", e.target.value)
                //           }
                //         />
                //       )}
                //     />
                //   ))}
                // </>
                // //   </FormGroup>
                // // </FormControl>
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
  setFormValue: (data) => dispatch(setValue(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateForm);
