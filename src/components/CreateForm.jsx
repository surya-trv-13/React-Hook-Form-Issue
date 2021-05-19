import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { data } from "../data.js";
import {
  TextField,
  FormControl,
  Button,
  FormLabel,
  FormGroup,
  MenuItem,
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
    register,
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
  const [file, setFile] = useState(null);
  const handlePreviousStep = () => {
    previousStep();
    reset(enteredData);
    console.log("DATA ENTERED", enteredData);
  };
  const handleFileInput = (event, name) => {
    console.log("Called File", event?.target?.files[0]);
    if (event.target.files) {
      setValue(name, event.target.files);
      setFile(event.target.files[0]?.name);
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

  const handleFile = (name, ref, rest) => {
    return (
      <input
        ref={(e) => {
          ref(e);
          handleFileClick.current = e;
        }}
        {...rest}
        type="file"
        hidden
        name={name}
        onChange={(e) => {
          rest.onChange(e);
          handleFileInput(e, name);
        }}
      />
    );
  };

  const [formState, setFormState] = React.useState({
    userRoles: []
  });

  const handleFieldChange = (event) => {
    console.log(event);
    event.persist();
    setFormState((formState) => ({
      ...formState,
      [event.target.name]:
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value
    }));
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
              console.log(
                "Data File:: ",
                getValues()?.[formField.name]?.[0]?.name
              );
              const { ref, ...rest } = register(formField.name, {});
              return (
                <>
                  {handleFile(formField.name, ref, rest)}

                  <FormControl variant="outlined">
                    <TextField
                      onChange={(e) => handleFileInput(e, formField.name)}
                      variant="outlined"
                      label={formField.label}
                      required={formField?.isMandatory}
                      InputLabelProps={{
                        shrink: true
                      }}
                      value={file}
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
                    <Button
                      variant="contained"
                      onClick={onAttachClick}
                      component="label"
                    >
                      Upload File
                    </Button>
                  </FormControl>
                </>
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
              );
            } else if (formField.type === "MultiSelectBox") {
              return (
                <Controller
                  key={index + formField.name}
                  control={control}
                  name={formField.name}
                  render={({ field }) => {
                    return (
                      <FormControl variant="outlined">
                        <TextField
                          {...field}
                          select
                          name="userRoles"
                          id="userRoles"
                          value={formState.userRoles}
                          variant="outlined"
                          label="userRoles"
                          SelectProps={{
                            multiple: true,
                            onChange: (e) => {
                              field.onChange(e);
                              handleFieldChange(e);
                            },
                            value: formState.userRoles
                          }}
                        >
                          {formField.content.map((value) => {
                            return (
                              <MenuItem value={value.optionValue}>
                                {value.optionName}
                              </MenuItem>
                            );
                          })}
                        </TextField>
                      </FormControl>
                    );
                  }}
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
  setFormValue: (data) => dispatch(setValue(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateForm);
