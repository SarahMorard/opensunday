import React, {useState} from "react";
import "./NavStyle.css";
import {Calendar} from "react-calendar";

// Set the state for calendar
function MyCalendar ()  {
    // Set state of the calendar
    const [date, setDate] = useState(new Date());

    //Handling the state when the date change
    const onChange = date => {
        setDate(date);
    };

    return (
        <div>
            <Calendar
                onChange={onChange}
                value={date}
            />
        </div>
    );
}


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
        return this.navRef.current.style.width = '250px';
    }

    render() {
        return (
            <div>
                <div className="topNav">
                    <a className="active" href="#home">Home</a>
                    <span class="settings" onClick={this.openNav}>ToolBox</span>
                </div>

                <div id="sideNav" className="sideNav" ref={this.navRef}>
                    <a href="javascript:void(0)" className="btnClose" onClick={this.closeNav}>&times;</a>
                    <input class="search" type="text" placeholder="Search.."/>
                    <br/>
                    <button class="btnSearch">Search</button>
                    <a href="#" onClick={MyCalendar}>Calendar</a>
                    <a href="#">Contact</a>
                </div>
            </div>

        );
    }
}
export default NavBars;
