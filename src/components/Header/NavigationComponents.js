import React from "react";
import "./NavStyle.css";

class NavBars extends React.Component {
    constructor(props) {
        super(props);
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
                <div className="topnav">
                    <input type="text" placeholder="Search.."/>
                    <a className="active" href="#home">Home</a>
                    <a href="#about">About</a>
                    <a href="#contact">Contact</a>

                    <span id="settings" onClick={this.openNav}>ToolBox</span>
                </div>

                <div id="mySidenav" className="sidenav" ref={this.navRef}>
                    <a href="javascript:void(0)" className="closebtn" onClick={this.closeNav}>&times;</a>
                    <a href="#">About</a>
                    <a href="#">Services</a>
                    <a href="#">Clients</a>
                    <a href="#">Contact</a>
                </div>
            </div>

        );
    }

}
export default NavBars;
