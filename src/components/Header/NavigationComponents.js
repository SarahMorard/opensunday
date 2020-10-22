import React, {useEffect, useState} from "react";
import "./NavStyle.css";
import {useAuth0} from "@auth0/auth0-react";
import request from "../../utils/request";
import endpoints from "../../endpoints";
import Loading from "../Loading";
import MyCalendar from "./CalendarComponents";
import {UserContext} from "../../Context/UserContext";
import {useHistory, useLocation} from "react-router-dom";


function NavBars() {
    // Reference for the navigation bar "sideNav"
    let [nav, setNavRef] = useState(false);
    let [administrator, setAdmin] = useState(false);
    let history = useHistory();
    let location = useLocation();

    let {
        loading,
        loginWithRedirect,
        logout,
        getAccessTokenSilently,
        isAuthenticated,
        user
    } = useAuth0();

    useEffect(() => {
        if(UserContext){

            setAdmin(true);
        }
    },[user])

    let toogleRef = (e) => {

        e.preventDefault();
        console.log(location);
        if(location.pathname == "/") {
            setNavRef(value => {
                return !value;
            });
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

    let onclickModifications = (e) => {
        e.preventDefault();
        history.push("/modif");
    }

    let onclickMap = (e) => {
        e.preventDefault();
        history.push("/")
    }

    let displayForm = (e) => {
        e.preventDefault();
        history.push("/addPOI")
    }

    return (
        <div>
            <div className="topNavBar">
                {location.pathname === "/" ?
                    <a className="btnToolbox" onClick={toogleRef} href={"#"}>ToolBox </a> : null
                }
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
                {/*if an admin is logged, show the button for see the modifications / to come again in the map*/}
                {administrator ? (
                    location.pathname === "/" ?
                        <a className="App-link" href="#" onClick={onclickModifications}>Modifications List</a>
                    :
                        <a className="App-link" href="#" onClick={onclickMap}>Return to map</a>
                ) : null}
            </div>

            {/*the content of the toolbox*/}
            <div id="toolbox" className="toolbox" style={{width: nav ? "20%" : 0}}>
                <a href="#" className="btnClose" onClick={toogleRef}>&times;</a>
                <MyCalendar/>
                <a onClick={displayForm} href={"#"}>Create an establishment</a>
            </div>
        </div>

    );

}

export default NavBars;
