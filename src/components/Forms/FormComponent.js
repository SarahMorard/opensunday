import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikControl from "../FormTemplate/FormikControl";
import "./FormComponents.css";

//A template for the formik forms
function FormComponent () {
    const dropDownOptions = [
        { key: "Select an option", value: ""},
        { key: "Restaurant", value: "1"},
        { key: "Bar", value: "2"},
        { key: "Museum", value: "3"}
    ];

    const radioOptions = [
        { key: "Open", value: "true"},
        { key: "Closed", value: "false"}
    ];

    const checkboxOptions = [
        { key: "Breackfast", value: "1"},
        { key: "Lunch", value: "2"},
        { key: "Dinner", value: "3"}
    ];

    const initialValues = {
        email: "",
        description: "",
        selectOption: "",
        radioOption: "",
        checkboxOption: []
    };
    const validationSchema = Yup.object({
        email: Yup.string().required("Required"),
        description: Yup.string().required("Required"),
        selectOption: Yup.string().required("Required"),
        radioOption: Yup.string().required("Required"),
        checkboxOption: Yup.array().required("Required")
    });

    const onSubmit = values => {
        console.log("FormTemplate data", values);
    };

    return (
        <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        >
            {formik => {
                return (<Form>
                        <FormikControl control="input" type="email" label="Email" name="email"/>
                        <FormikControl control="textarea" label="Description" name="description"/>
                        <FormikControl control="select" label="Type of establishment" name="selectOptions"
                                       options={dropDownOptions}/>
                        <FormikControl control="radio" label="Status of the establishment" name="radioOption"
                                       options={radioOptions}/>
                        <FormikControl control="checkbox" label="open at" name="checkboxOption"
                                       options={checkboxOptions}/>
                        <button type="submit">Submit</button>
                    </Form>
                )}
            }
        </Formik>
    )
}
export default FormComponent;