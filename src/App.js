import React, { useState } from "react";
import "./App.css";
import NavBars from "./components/Header/NavigationComponents";
import MyMap from "./pages/MapPage";
import InfosEstablishment from "./components/Infos/InfosEstablishmentComponents";

function App() {
    let [display, setDisplay] = useState(true);

    // Method toogle for the state
    const toggleChangeDisplay = () => {
        setDisplay(d => !d)
    }

    return (
        <div class="App">
          <NavBars/>
          <InfosEstablishment display={display} toggleChangeDisplay={toggleChangeDisplay}/>
          <MyMap toggleChangeDisplay={toggleChangeDisplay}/>

        </div>
    );
}

export default App;