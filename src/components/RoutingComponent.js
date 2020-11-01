import React, {useEffect, useState} from "react";
import "./RoutingComponent.css";
import {useAuth0} from "@auth0/auth0-react";
import {Route, useHistory} from "react-router-dom";
import NavBars from "./Header/NavigationComponents";
import InfosEstablishment from "./Infos/InfosEstablishmentComponents";
import MyMap from "../pages/MapPage";
import {Form, Formik} from "formik";
import FormikControl from "./FormTemplate/FormikControl";
import * as Yup from "yup";
import {UserContext} from "../Context/UserContext";
import Modifications from "./Modifications/Modifications";
import CreationForm from "./Forms/CreationForm"
import Request from "../utils/request"
import endpoints from "../endpoints.json"
import {Marker, Popup} from "react-leaflet";

//a function for render all the route and use the history
function RoutingComponent() {

    //All the Auth0 methods needed
    const {user, logout, getAccessTokenSilently, loginWithRedirect} = useAuth0();

    //take the username of github for the welcome message
    const [userName, setUsername] = useState(null);

    //the state for the InfoEstablishment
    const [display, setDisplay] = useState(true);

    //set if the navbar is render or not
    const [navbarVisible, setNavbarVisible] = useState(true);

    //the user logged in (for set the context)
    const [userDB, setUser] = useState(null);

    let history = useHistory();

    // POIs
    const [pois, setPois] = useState(null);


    //Fetch all the establishments that are stored in the db
    useEffect(() => {
        async function fetchEstablishments() {

            let listOfEstablishment = await Request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.establishments}`,
                getAccessTokenSilently,
                loginWithRedirect
            );
            setPois(listOfEstablishment);
        }
        //prevent an autologin at the start of the app
        if(user) {
            fetchEstablishments();
        }
    }, [user]);



    useEffect(() => {

        // fetch user from DB
        async function fetchUserFromDB() {

            let dbUser = await Request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.users}` + "/" + user.sub,
                getAccessTokenSilently,
                loginWithRedirect
            );

            if(dbUser.status === 404) {
                dbUser = null;
            }

            setUser(dbUser);

            //is the user already in our db if yes, connect if not go in the register page
            if (dbUser !== null) {
                //is the user ban ? if yes, don't let him to connect
                if(dbUser.isBanned){
                    alert("You are ban");
                    logout({returnTo: window.location.origin});
                } else {
                    //set the context with the user infos!
                }

            } else {
                toogleNavbar();
                history.push('/register')
            }
        }
        //set the github nickname of the guy who connect
        if (user) {
            setUsername(user.nickname);
            fetchUserFromDB();
        }
    }, [user]);

    const initialValues = {
        firstname: "",
        lastname: ""
    };

    const validationSchema = Yup.object({
        firstname: Yup.string().required("Required"),
        lastname: Yup.string().required("Required")
    });

    //change the navbarVisible
    let toogleNavbar = () => {
        setNavbarVisible(visible => {
            return !visible;
        });
    }

    //when someone register, put him in the db and go back in the home
    const onsubmit = async(values) => {
        //call the db with firstname and lastname for insert a user in the db

        const data = {
            githubID: user.sub,
            firstname: values.firstname,
            lastname: values.lastname
        };

        await Request(
            `${process.env.REACT_APP_SERVER_URL}${endpoints.users}`,
            getAccessTokenSilently,
            loginWithRedirect,
            "POST",
            data
        );
        toogleNavbar();
    }

    const toogleChangeDisplay = () => {
        setDisplay(d => !d);
    }

    return (
        <UserContext.Provider value={{user : userDB}}>
            {/*render the navbar*/}
            {navbarVisible ? <NavBars/> : null}

            {/*the welcome page with the navbar and the map*/}
            <Route path="/"
                   exact
                   render={() =>
                       <>
                                   <MyMap toogleChangeDisplay={toogleChangeDisplay} poi = {[]} />
                       </>
                   }
            />

            {/*the register page with the form*/}
            <Route path="/register"
                   render={() =>
                       <Formik
                           initialValues={initialValues}
                           validationSchema={validationSchema}
                           onSubmit={onsubmit}
                       >
                           {formik => {
                               return (<Form className="registerForm">
                                       <h2>Welcome {userName}, please enter your infos to finish your register</h2>
                                       <br/> <br/>
                                       <FormikControl control="input" type="text" label="Firstname :" name="firstname"/>
                                       <br/>
                                       <FormikControl control="input" type="text" label="Lastname :" name="lastname"/>
                                       <br/>
                                       <button type="submit">Submit</button>
                                   </Form>
                               )}
                           }
                       </Formik>}
            />

            {/*The page with all the modifications done by some users (for the admins)*/}
            <Route path="/modif"
                   render={() =>
                       <>
                           <Modifications/>
                       </>
                   }
            />

            {/*the page for create a new establishment*/}
            <Route path="/addPOI"
                   component={CreationForm}
            />


            {/*the route for the details of each establishment (/location/id) */}
            <Route path="/location/:eid"
                   render={() =>
                            <>
                           {pois != null && pois && pois.length > 0 &&
                           <>
                               <InfosEstablishment display={display} poi={pois}/>
                           </>
                           }
                           </>

                   }
            />


            {/*the route for the details of each establishment (/location) */}
            <Route path="/location"
                   render={() =>
                       <>
                           {pois != null && pois && pois.length > 0 &&
                           <>
                               <MyMap toogleChangeDisplay={toogleChangeDisplay} poi={pois} />
                           </>
                           }
                       </>

                   }
            />

        </UserContext.Provider>
    );

}

export default RoutingComponent;
