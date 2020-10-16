import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikControl from "../FormTemplate/FormikControl";
import "./FormComponents.css";

function RegisterForm () {

    const initialValues = {
        firstname: "",
        lastname: ""
    };
    const validationSchema = Yup.object({
        firstname: Yup.string().required("Required"),
        lastname: Yup.string().required("Required")
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
                        <FormikControl control="input" type="text" label="Firstname :" name="firstname"/>
                        <FormikControl control="input" type="text" label="Lastname :" name="lastname"/>
                        <button type="submit">Submit</button>
                    </Form>
                )}
            }
        </Formik>
    )
}
export default RegisterForm;