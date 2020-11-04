import React from "react";
import loading from "../assets/loading.svg";

//the loading component
const Loading = () => (
  <div className="spinner">
    <img src={loading} alt="Loading" />
  </div>
);

export default Loading;
