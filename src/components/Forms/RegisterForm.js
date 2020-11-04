import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikControl from "../FormTemplate/FormikControl";
import "./FormComponents.css";
import "../../App"
import toogleRegister from "../../App"

//The register form
function RegisterForm () {

    //The initial value for formik
    const initialValues = {
        firstname: "",
        lastname: ""
    };

    //The yup validation schema
    const validationSchema = Yup.object({
        firstname: Yup.string().required("Required"),
        lastname: Yup.string().required("Required")
    });

    //The form
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={toogleRegister}
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