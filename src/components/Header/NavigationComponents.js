import React, { useState } from "react";
import "./NavStyle.css";
import { useAuth0 } from "@auth0/auth0-react";
import request from "../../utils/request";
import endpoints from "../../endpoints";
import Loading from "../Loading";
import React from "react";
import MyCalendar from "./CalendarComponents";
import MyMap from "../../pages/MapPage";

function NavBars() {
    // Reference for the navigation bar "sideNav"
    let [nav, setNavRef] = useState(false);

    let {
        loading,
        loginWithRedirect,
        logout,
        getAccessTokenSilently,
        isAuthenticated,
    } = useAuth0();

    let toogleRef = () => {

        nav ? setNavRef(false) : setNavRef(true)
    }

    let handleLocationsClick = async (e) => {
        e.preventDefault();
        let locations = await request(
            `${process.env.REACT_APP_SERVER_URL}${endpoints.locations}`,
            getAccessTokenSilently,
            loginWithRedirect
        );
    };

    let handleLogoutClick = async (e) => {
        e.preventDefault();
        /*
        returnTo parameter is necessary because multiple
        apps use the same authentication backend
        */
        logout({returnTo: window.location.origin});
    };

    if (loading) {
        return <Loading/>;
    }

    //Function to call the calendar and displays it
    let callCalendar = () => {
        return (
            <div></div>
        );

    return (
        <div>
            <div className="topNavBar">
                <a className="btnToolbox" onClick={toogleRef}>ToolBox</a>
                {isAuthenticated ? (
                    <a
                        className="App-link Logout-link"
                        href="#"
                        onClick={handleLogoutClick}
                    >
                        Logout
                    </a>
                ) : (
                    <a
                        className="App-link"
                        href="#"
                        onClick={handleLocationsClick}
                    >
                        Login
                    </a>
                )}

            </div>

            <div id="toolbox" className="toolbox" style={{width: nav? "20%" : 0}}>
                <a href="javascript:void(0)" className="btnClose" onClick={toogleRef}>&times;</a>
                <input class="searchBar" type="text" placeholder="Search.."/>
                <br/>
                <button class="btnSearch">Search</button>
                <a onClick={callCalendar}>Calendar</a>
                <a href="#">Contact</a>
            </div>
        </div>

    );
}

export default NavBars;
