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
            nav ? setNavRef(false) : setNavRef(true);
        } else {
            onclickModifications();
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

        let location = "/"
        setMapVisible(visible => {
            if(visible) location = "/modif";
            return !visible;
        });

        history.push(location);
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

                {/*if an admin is logged, show the button for see the modifications / to come again in the map*/}
                {administrator ? (
                    <a
                        className="App-link"
                        href="#"
                        onClick={onclickModifications}
                    >
                        {/*if the map is visible, the button is "Modification list" and if the modif is visible, the button is "map"*/}
                        {mapVisible ? "Modifications List" : "Map"}
                    </a>
                ) : null}
            </div>

            {/*the content of the toolbox*/}
            <div id="toolbox" className="toolbox" style={{width: nav ? "20%" : 0}}>
                <a href="javascript:void(0)" className="btnClose" onClick={toogleRef}>&times;</a>hopy
                <MyCalendar/>
                <a onClick={displayForm}>Create an establishment</a>
            </div>
        </div>

    );

}

export default NavBars;
