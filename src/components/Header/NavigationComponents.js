import React, {useState, useContext} from "react";
import "./NavStyle.css";
import {useAuth0} from "@auth0/auth0-react";
import Loading from "../Loading";
import MyCalendar from "./CalendarComponents";
import {UserContext} from "../../Context/UserContext";
import {useHistory, useLocation} from "react-router-dom";

//the function for render and manage the navbar
function NavBars() {

    // Reference for the navigation bar "sideNav"
    let [nav, setNavRef] = useState(false);

    //Some React Router components
    let history = useHistory();
    let location = useLocation();

    //the context
    let context = useContext(UserContext);

    //All the Auth0 methods needed
    let {
        loading,
        loginWithRedirect,
        logout,
        getAccessTokenSilently,
        isAuthenticated
    } = useAuth0();

    //Set the toolbox open or close (conditional rendering in the return)
    let toogleRef = (e) => {
        e.preventDefault();

        setNavRef(value => {
            return !value;
        });
    }

    //the login method for login with github
    let handleLocationsClick = async (e) => {
        e.preventDefault();
        await loginWithRedirect();
    };

    //the logout method
    let handleLogoutClick = async (e) => {
        e.preventDefault();

        //returnTo parameter is necessary because multiple apps use the same authentication backend
        logout({returnTo: window.location.origin});
    };

    //return the loading component if it needs
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

    //when click on the link, render the form for add an establishment
    let displayForm = (e) => {
        e.preventDefault();
        history.push("/addPOI")
    }


    return (
        <header>
            <div className="topNavBar">
                <a className="btnToolbox" onClick={toogleRef} href={"#"}>ToolBox </a>

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
                {context.user !== null && context.user.isAdmin ? (
                    location.pathname === "/modif" ?
                        <a className="App-link" href="#" onClick={onclickMap}>Return to map</a>
                        :
                        <a className="App-link" href="#" onClick={onclickModifications}>Modifications List</a>
                ) : null}

                {/*If we are in a form create or modify, we want to go back to the home*/}
                {location.pathname === "/addPOI" || location.pathname === "/modify" ?
                    <a className="App-link" href="#" onClick={() => history.push("/")}>Return to map</a>
                    :
                    null
                }

            </div>

            {/*the content of the toolbox*/}
            <div id="toolbox" className="toolbox" style={{width: nav ? "20%" : 0}}>
                <a href="#" className="btnClose" onClick={toogleRef}>&times;</a>

                <MyCalendar
                    history={history}
                />
                <a onClick={displayForm} href={"#"}>Create an establishment</a>
            </div>
        </header>
    );

}

export default NavBars;
