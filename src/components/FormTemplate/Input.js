import React from "react";
import {Field, ErrorMessage} from "formik";
import TextError from "./TextErrorComponent";

//The component Formik for Input text field
function Input (props) {
    const { label, name, ...rest } = props;

    return (
        <div className="form-control">
            <label htmlFor={name} className="label">{label}</label>
            <Field id={name} name={name} {...rest} className="field"/>
            <ErrorMessage name={name} component={TextError}/>
        </div>
    )
}
export default Input;
