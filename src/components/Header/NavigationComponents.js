import React, {useEffect, useState} from "react";
import "./NavStyle.css";
import {useAuth0} from "@auth0/auth0-react";
import request from "../../utils/request";
import endpoints from "../../endpoints";
import Loading from "../Loading";
import MyCalendar from "./CalendarComponents";
import {UserContext} from "../../Context/UserContext";
import {useHistory} from "react-router-dom";


function NavBars() {
    // Reference for the navigation bar "sideNav"
    let [nav, setNavRef] = useState(false);
    let [administrator, setAdmin] = useState(false);
    let [mapVisible, setMapVisible] = useState(true);
    let history = useHistory();

    let {
        loading,
        loginWithRedirect,
        logout,
        getAccessTokenSilently,
        isAuthenticated,
        user
    } = useAuth0();

    useEffect(() => {
        console.log(UserContext.admin);
        console.log(UserContext.firstname);
        console.log(UserContext.lastname);
        console.log(UserContext.token);
        if(UserContext){

            setAdmin(true);
        }
    },[user])

    let toogleRef = () => {
        if(mapVisible) {
            nav ? setNavRef(false) : setNavRef(true)
        } else {
            setMapVisible(true);
            history.push("/");
        }
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

    let onclickModifications = () => {
        if(mapVisible){
            setMapVisible(false);
            history.push("/modif");
        } else {
            setMapVisible(true);
            history.push("/");
        }

        console.log(mapVisible);
    }

    let displayForm = () => {
        history.push("/addPOI")
    }

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
                {administrator ? (
                    <a
                        className="App-link"
                        href="#"
                        onClick={onclickModifications}
                    >
                        {mapVisible ? "Modifications List" : "Map"}
                    </a>
                ) : null}
            </div>

            <div id="toolbox" className="toolbox" style={{width: nav ? "20%" : 0}}>
                <a href="javascript:void(0)" className="btnClose" onClick={toogleRef}>&times;</a>
                <a>Calendar</a>
                <MyCalendar/>
                <a onClick={displayForm}>Create an establishment</a>
            </div>
        </div>

    );

}

export default NavBars;
