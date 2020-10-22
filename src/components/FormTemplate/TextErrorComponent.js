import React from "react";

//The component Formik for the errors
function TextError(props) {
    return (
        <div className="error">
            {props.children}
        </div>
    )
}

export default TextError