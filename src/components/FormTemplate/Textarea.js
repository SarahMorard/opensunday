import React from "react";
import {Field, ErrorMessage} from "formik";
import TextError from "./TextErrorComponent";

//The component Formik for text areas
function Textarea (props) {
    const { label, name, ...rest } = props;

    return (
        <div className="form-control">
            <label htmlFor={name} className="label">{label}</label>
            <Field as="textarea" id={name} name={name} {...rest} className="field"/>
            <ErrorMessage name={name} component={TextError}/>
        </div>
    )
}
export default Textarea;
