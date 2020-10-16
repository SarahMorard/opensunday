import React, { useState } from "react";
import "./App.css";
import NavBars from "./components/Header/NavigationComponents";
import MyMap from "./pages/MapPage";
import InfosEstablishment from "./components/Infos/InfosEstablishmentComponents";

function App() {
    const [display, setDisplay] = useState(0);



    return (
        <div class="App">
            <NavBars />
            <InfosEstablishment />
            <MyMap/>
        </div>
    );
}

export default App;