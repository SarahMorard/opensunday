import React from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import Home from "./components/Home";


function App() {

    //the router with the Home component(the home component have all the routes)
    return (
        <Router>
            <div className="App">
                <Home/>
            </div>
        </Router>
    );
}

export default App;
