import React, { useState } from "react";
import "./App.css";
import NavBars from "./components/Header/NavigationComponents";
import MyMap from "./pages/MapPage";

function App() {



    return (
        <div className="App">
            <NavBars/>
            <MyMap />
        </div>
    );
}

export default App;