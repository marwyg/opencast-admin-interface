import React from "react";
import { connect } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { Field } from "formik";
import {
	getWorkflowDefById,
	makeGetWorkflowDefById,
} from "../../../../selectors/workflowSelectors";

/**
 * This component renders the configuration panel for the selected workflow in the processing step of the new event
 * wizard chosen via dropdown.
 * Here, props is used instead of {} containing name of each prop because props are needed in the selector for finding
 * the workflow definition with the matching id. In this case props need to be considered in mapStateToProps and
 * therefore {} containing names of props not works.
 */
const RenderWorkflowConfig = (props) => {
	// Get html for configuration panel
	const configPanel = !!props.configuration_panel_json
		? props.configuration_panel_json
		: [];
	const description = !!props.description ? props.description : "";
	const displayDescription = !!props.displayDescription;
	let formik = props.formik;

	const descriptionBoxStyle = {
		margin: "15px 0 0 0",
		position: "relative",
		border: "solid #c9d0d3",
		borderWidth: "1px",
		backgroundColor: "#fafafa",
		overflow: "hidden",
		borderRadius: "4px",
	};

	const descriptionTextStyle = {
		margin: "10px",
		fontFamily: '"Open sans", Helvetica,sans-serif',
		fontSize: "12px",
		whiteSpace: "pre-line",
	};

	return (
		<>
			{displayDescription && description.length > 0 && (
				<div className="collapsible-box" style={descriptionBoxStyle}>
					<div style={descriptionTextStyle}>{description}</div>
				</div>
			)}

			{configPanel.length > 0 && (
				<form>
					<div id="workflow-configuration">
						{configPanel.map((configOption, key) => (
							<fieldset key={key}>
								{!!configOption.legend && (
									<legend>{configOption.legend}</legend>
								)}
								{!!configOption.description && (
									<p>{configOption.description}</p>
								)}
								<ul>
									{configOption.fieldset?.map((field, keys) =>
										renderInputByType(field, keys, formik)
									)}
								</ul>
							</fieldset>
						))}
					</div>
				</form>
			)}
		</>
	);
};

// render input depending on field type
const renderInputByType = (field, key, formik) => {
	switch (field.type) {
		case "checkbox":
			return <RenderCheckbox field={field} key={key} formik={formik} />;
		case "radio":
			return <RenderRadio field={field} key={key} formik={formik} />;
		case "number":
			return <RenderNumber field={field} key={key} formik={formik} />;
		case "text":
			return <RenderText field={field} key={key} formik={formik} />;
    case "datetime-local":
      return <RenderDatetimeLocal field={field} key={key} formik={formik} />;
		default:
			return "";
	}
};

const RenderDatetimeLocal = ({ field, key, formik }) => {
  field.value = undefined;

  return <RenderField field={field} key={key} formik={formik} />;
};

const RenderCheckbox = ({ field, key, formik }) => {
  field.defaultValue = field.value;
  field.value = undefined;

  return <RenderField field={field} key={key} formik={formik} />;
};

const RenderRadio = ({ field, key, formik }) => {
  return <RenderField field={field} key={key} formik={formik} />;
};

const RenderNumber = ({ field, key, formik }) => {
	// validate that value of number is between max and min
	const validate = (value) => {
		let error;
		if (parseInt(value) > field.max || parseInt(value) < field.min) {
			error = "out of range";
		}
		return error;
	};

  field.defaultValue = field.value;
  field.value = undefined;

  return <RenderField field={field} key={key} formik={formik} validate={validate}/>;
};

const RenderText = ({ field, key, formik }) => {
  field.value = undefined;

  return <RenderField field={field} key={key} formik={formik} />;
};

const RenderField = ({field, key, formik, validate = undefined }) => {
	// id used for Field and label
	const uuid = uuidv4();
	const disabled = !!field.disabled ? field.disabled : false;

  // Only set value to *anything* if there is actually a value to be had
  // Otherwise it empties the displayed value when switching between tabs
  const renderField = () => {
    if (field.value) {
      return(
        <Field
          id={uuid}
          defaultValue={field.defaultValue}
          value={field.value}
          validate={validate}
          className="configField"
          name={"configuration." + field.name}
          disabled={disabled}
          type={field.type}
          min={field.min}
          max={field.max}
        />
      )
    } else {
      return(
        <Field
          id={uuid}
          defaultValue={field.defaultValue}
          validate={validate}
          className="configField"
          name={"configuration." + field.name}
          disabled={disabled}
          type={field.type}
          min={field.min}
          max={field.max}
        />
      )
    }
  }

	return (
		<li key={key}>
			{renderField()}
			<label htmlFor={uuid}>{field.label}</label>
			{/* if input has an additional fieldset or further configuration inputs
            then render again by input type*/}
			{!!field.fieldset && !!formik.values.configuration[field.name] && (
				<ul className="workflow-configuration-subpanel">
					{field.fieldset?.map((f, keys) => renderInputByType(f, keys, formik))}
				</ul>
			)}
		</li>
	);
}

// Getting state data out of redux store
const mapStateToProps = () => {
	getWorkflowDefById();
	return (state, props) => makeGetWorkflowDefById(state, props);
};

export default connect(mapStateToProps)(RenderWorkflowConfig);