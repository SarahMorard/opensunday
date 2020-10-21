import React from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import Home from "./components/Home";


function App() {

    return (
        <Router>
            <div className="App">
                <Home/>
            </div>
        </Router>
    );
}

export default App;
