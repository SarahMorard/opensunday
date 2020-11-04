import React from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import RoutingComponent from "./components/RoutingComponent";
import FooterComponent from "./components/Footer/FooterComponent";


function App() {

    //the router with the RoutingComponent component with all the routes and the footer
    return (
        <Router>
            <div className="App">
                <RoutingComponent/>
                <FooterComponent/>
            </div>
        </Router>
    );
}

export default App;
