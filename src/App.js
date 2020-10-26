import React from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import RoutingComponent from "./components/RoutingComponent";
import FooterComponent from "./components/Footer/FooterComponent";


function App() {

    //the router with the RoutingComponent component(the home component have all the routes)
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
