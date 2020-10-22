import React, {useEffect, useState} from "react";
import "./NavStyle.css";
import {useAuth0} from "@auth0/auth0-react";
import request from "../../utils/request";
import endpoints from "../../endpoints";
import Loading from "../Loading";
import MyCalendar from "./CalendarComponents";
import {UserContext} from "../../Context/UserContext";
import {useHistory, useLocation} from "react-router-dom";

//the function for render and manage the navbar
function NavBars() {
    // Reference for the navigation bar "sideNav"
    let [nav, setNavRef] = useState(false);

    //A boolean state for know when display the admin stuff
    let [administrator, setAdmin] = useState(false);

    //Some React Router components
    let history = useHistory();
    let location = useLocation();

    //All the Auth0 methods needed
    let {
        loading,
        loginWithRedirect,
        logout,
        getAccessTokenSilently,
        isAuthenticated,
        user
    } = useAuth0();

    //effect triggered when a new user is logged for know if it's an admin or not
    useEffect(() => {
        if(UserContext){
            //change if the user is an admin with the context (context not finished yet)
            setAdmin(true);
        }
    },[user])

    //if we are on the map, set the toolbox open or close (conditional rendering in the return)
    let toogleRef = (e) => {
        e.preventDefault();
        if(location.pathname === "/" || location.pathname === "/location") {
            setNavRef(value => {
                return !value;
            });
        }
    }

    //the login method for login with github
    let handleLocationsClick = async (e) => {
        e.preventDefault();
        let locations = await request(
            `${process.env.REACT_APP_SERVER_URL}${endpoints.locations}`,
            getAccessTokenSilently,
            loginWithRedirect
        );

    };

    //the logout method
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

    //when click on the button, push the modif page
    let onclickModifications = (e) => {
        e.preventDefault();
        history.push("/modif");
    }

    //when click on the button, push the default page
    let onclickMap = (e) => {
        e.preventDefault();
        history.push("/")
    }

    //when click on the link, render the form for add an establishment (not finished yet)
    let displayForm = (e) => {
        e.preventDefault();
        history.push("/addPOI")
    }

    return (
        <div>
            <div className="topNavBar">
                {/*Render the toolbox button if the map is visible*/}
                {location.pathname === "/" || location.pathname === "/location" ?
                    <a className="btnToolbox" onClick={toogleRef} href={"#"}>ToolBox </a> : null
                }
                {/*render the login button if no one is logged and the logout button if someone is connected*/}
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
