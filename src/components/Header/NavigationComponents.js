import "./NavStyle.css";
import React from "react";
import MyCalendar from "./CalendarComponents";

class NavBars extends React.Component {
    constructor(props) {
        super(props);
        // Reference for the navigation bar "sideNav"
        this.navRef = React.createRef();
    }
    
    //Close the navigation bar
    //Set the width of the bar to 0 to close it
    closeNav = () => {
        return this.navRef.current.style.width = 0;
    }

    //Open the navigation bar
    //Set the width of the bar to 250px to open it
    openNav = () => {
        return this.navRef.current.style.width = '20%';
    }

    //Function to call the calendar and displays it
    callCalendar = () => {
        return <div class="test">Hello</div>
    }

    render() {
        return (
            <div>
                <div class="topNavBar">
                    <a className="login" href="#login">Login</a>
                    <a class="home" href="#">Home</a>
                    <span class="btnToolbox" onClick={this.openNav}>ToolBox</span>
                </div>

                <div id="toolbox" className="toolbox" ref={this.navRef}>
                    <a href="javascript:void(0)" className="btnClose" onClick={this.closeNav}>&times;</a>
                    <input class="searchBar" type="text" placeholder="Search.."/>
                    <br/>
                    <button class="btnSearch">Search</button>
                    <a >Calendar</a>
                    <a href="#">Contact</a>

                </div>
            </div>

        );
    }
}

export default NavBars;
