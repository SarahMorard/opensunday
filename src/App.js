import React, { useState } from "react";
import "./App.css";
import NavBars from "./components/Header/NavigationComponents";
import MyMap from "./pages/MapPage";
import InfosEstablishment from "./components/Infos/InfosEstablishmentComponents";
import MyCalendar from "./components/Header/CalendarComponents";

function App() {
    return (
        <div class="App">
          <NavBars/>
          <InfosEstablishment/>


        </div>
    );
}

export default App;