import React, {useEffect, useState} from "react";
import "./Home.css";
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

function Home() {

    const {user, getAccessTokenSilently, logout} = useAuth0();
    const [userName, setUsername] = useState(null);
    let history = useHistory();

    const initialValues = {
        firstname: "",
        lastname: ""
    };
    const validationSchema = Yup.object({
        firstname: Yup.string().required("Required"),
        lastname: Yup.string().required("Required")
    });

    const onsubmit = () => {
        //call the db with firstname and lastname for insert a user in the db
        history.goBack();
    }

    useEffect(() => {

        // fetch user from DB
        async function fetchUserFromDB() {

            //envoye l'id du user logged au backend et récup le user ou null
            const userTest = {
                firstname: "Nicolas",
                lastname: "Constantin",
                admin: true,
                ban: true
            };
            let dbUser = userTest;

            if (dbUser !== null) {
                if(dbUser.ban){
                    alert("You are ban");
                    logout({returnTo: window.location.origin});
                } else {
                    //context !
                    UserContext.token = await getAccessTokenSilently();
                    UserContext.firstname = dbUser.firstname;
                    UserContext.lastname = dbUser.lastname;
                    UserContext.admin = dbUser.admin;

                    console.log(UserContext.admin);
                    console.log(UserContext.firstname);
                    console.log(UserContext.lastname);
                    console.log(UserContext.token);
                }

            } else {
                history.push('/register')
            }
        }

        if (user) {
            setUsername(user.nickname);
            fetchUserFromDB();
        }
    }, [user]);



    return (
        <>
            <Route path="/"
                exact
                render={() => <>
                   <NavBars/>
                   <InfosEstablishment/>
                   <MyMap/>
                   </>
                }
            />
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
            <Route path="/modif"
                render={() =>
                    <>
                        <NavBars/>
                        <Modifications/>
                    </>
                }
            />
            <Route path="/addPOI"
                render={() =>
                    <>
                        <CreationForm/>
                    </>
                }
            />
        </>
    );

}

export default Home;
