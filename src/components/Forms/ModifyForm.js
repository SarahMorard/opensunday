import React, {useContext, useReducer, useState} from "react";
import {Formik, Form} from "formik";
import * as Yup from "yup";
import FormikControl from "../FormTemplate/FormikControl";
import "./FormComponents.css";
import "./CreationForm.css";
import "../../App"
import 'react-nice-dates/build/style.css'
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import {usePosition} from "use-position";
import {Map, TileLayer} from "react-leaflet";
import Request from "../../utils/request";
import endpoints from "../../endpoints.json";
import {useAuth0} from "@auth0/auth0-react";
import {UserContext} from "../../Context/UserContext";

//this function will add or remove the given date from the list of date
function dayReducer(state, action) {
    switch (action.type) {
        case "add":
            return [...state, action.day];
        case "remove":
            const update = [...state];
            let dayToDeleteIndex = update.findIndex(d => d.getTime() === action.day.getTime());
            update.splice(dayToDeleteIndex, 1);
            return update;
        default:
            return state;
    }
}

//The Modify form
function ModifyForm(props) {

    //the data of the establishment to modify
    const data = props.data;
    console.log(data);

    //this reducer is a state for manage lists. It will be empty because of type missmatch for dates between the frontend and the backend
    const [selectedDay, setDays] = useReducer(dayReducer, data.establishmentDates);

    //states for get back the latitude and the longitude
    const [lat, setLat] = useState(data.lat);
    const [long, setLong] = useState(data.lng);

    //states for display the "please modify something" text
    const [modifDone, setModifDone] = useState(false);

    // Const to keep track of the position of the user
    const watch = true;

    // Const for the position of the user
    const {
        latitude,
        longitude
    } = usePosition(watch);

    //the context
    let context = useContext(UserContext);

    //get Auth0 infos
    let {
        loginWithRedirect,
        getAccessTokenSilently,
    } = useAuth0();

    //the list of options available for the user to choose the type of establishment
    const TypesOptions = [
        {key: "Select an option", value: ""},
        {key: "Restaurant", value: "2"},
        {key: "Bar", value: "4"},
        {key: "Nightclub", value: "9"},
        {key: "Cinema", value: "10"},
        {key: "Theatre", value: "11"},
        {key: "Casino", value: "12"},
        {key: "Museum", value: "13"},
        {key: "Public transport", value: "16"},
        {key: "Hotel", value: "23"},
        {key: "Shop", value: "39"},
        {key: "Chemist's", value: "34"},
        {key: "Ambulance", value: "43"},
        {key: "Hospital", value: "58"},
        {key: "Fire Brigade", value: "44"},
        {key: "Police", value: "45"},
        {key: "Post Office", value: "46"},
        {key: "Tourist Information", value: "47"},
        {key: "Petrol Station", value: "48"},
        {key: "Police", value: "45"},
        {key: "Car Hire", value: "50"},
        {key: "Car Repair", value: "51"},
        {key: "Travel Agency", value: "52"},
        {key: "Business", value: "54"},
        {key: "Library", value: "61"},
        {key: "Parking", value: "63"},
        {key: "Religious Place", value: "67"},
        {key: "Theme Park", value: "70"},
        {key: "Zoo", value: "71"},
    ];

    //the initial values for formik
    const initialValues = {
        name: data.name,
        type: data.type.id,
        description: data.description,
        address: data.address,
        npa: data.city.postalCode,
        city: data.city.name,
        website: data.webSite,
    };

    //the yup validation schema
    const validationSchema = Yup.object({
        name: Yup.string().required("Required"),
        type: Yup.string().required("Required"),
        description: Yup.string().required("Required"),
        address: Yup.string().required("Required"),
        npa: Yup.string().required("Required"),
        city: Yup.string().required("Required"),
        website: Yup.string().required("Required")
    });

    //the managment of the calendar
    const handleDayClick = (day) => {
        let isAlreadySelected = false;

        //select if the day clicked by the user is already selected or not
        selectedDay.map((item, index) => {
                if (item.getTime() === day.getTime()) {
                    isAlreadySelected = true;
                }
            }
        )

        //if it's already selected, call the method remove, if it's not, call the add method
        if (!isAlreadySelected) {
            setDays({day, type: "add"});
        } else {
            setDays({day, type: "remove"});
        }

    }

    //The effect of the modify button
    const submitMethod = async (value) => {

        //creation of the data
        const dataToInsert = {
            name: value.name !== data.name ? value.name : null,
            description: value.description !== data.description ? value.description : null,
            address: value.address !== data.address ? value.address : null,
            webSite: value.website !== data.webSite ? value.website : null,
            lat: lat,
            lng: long,
            deleted: false,
            establishment: {
              establishmentId: data.establishmentId
            },
            city: {
                postalCode: value.npa,
                name: value.city
            },
            type: {
                id: value.type
            },
            user: {
              GithubId: context.user.githubId
            },
            //date format don't match from frontend to backend (frontend is strings and backend are VisualStudio dates objects)
            modificationDates: []
        }

        console.log(JSON.stringify(dataToInsert));

        //check if something change in the modification
        let isChanges = false;
        if(dataToInsert.name !== null)
            isChanges = true;
        if(dataToInsert.description !== null)
            isChanges = true;
        if(dataToInsert.address !== null)
            isChanges = true;
        if(dataToInsert.webSite !== null)
            isChanges = true;
        if(dataToInsert.lat !== null)
            isChanges = true;
        if(dataToInsert.lng !== null)
            isChanges = true;
        if(dataToInsert.city.postalCode !== null)
            isChanges = true;
        if(dataToInsert.city.name !== null)
            isChanges = true;
        if(dataToInsert.type.id !== null)
            isChanges = true;

        console.log(isChanges);

        //sent the POST request
        if(isChanges){
            setModifDone(false);
            await Request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.modifications}`,
                getAccessTokenSilently,
                loginWithRedirect,
                "POST",
                dataToInsert
            );
            console.log(`${process.env.REACT_APP_SERVER_URL}${endpoints.modifications}`);
        } else {
            setModifDone(true);
        }

    }

    //set the value when the user click on the map
    const handleClickMap = (e) => {
        setLat(e.latlng.lat);
        setLong(e.latlng.lng);
    }

    //the form
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={submitMethod}
        >
            {formik => {
                return (<Form className="background">
                        <h2>Create an establishment</h2>
                        <FormikControl control="input" type="text" label="Name" name="name"/>
                        <FormikControl control="select" label="Type of establishment" name="type"
                                       options={TypesOptions}/>
                        <FormikControl control="textarea" label="Description" name="description"/>
                        <FormikControl control="input" type="text" label="Address" name="address"/>
                        <FormikControl control="input" type="number" label="NPA" name="npa"/>
                        <FormikControl control="input" type="text" label="City" name="city"/>
                        <FormikControl control="input" type="text" label="Website" name="website"/>
                        <label className="label">Select the dates when the establishment is closed</label>

                        {/*the calendar for select the day when the establishment is closed*/}
                        <DayPicker
                            className="calendarInForm"
                            onDayClick={handleDayClick}
                            selectedDays={selectedDay}
                        />

                        {/*the map for select where is the establishment*/}
                        <div className="theMap">
                            {longitude && latitude ?
                                <Map center={[latitude, longitude]} zoom={14} onClick={handleClickMap}>
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>
                            contributors'
                                    />

                                </Map> : <div style={{color: "white", fontSize: 24}}>Getting geolocation...</div>
                            }
                        </div>
                        <p>Your latitude: {lat}</p>
                        <p>Your longitude: {long}</p>

                        {modifDone ? <p style={{color: "red", fontSize: 16}}>Please, change something before validate</p> : null}
                        <button type="submit">Modify</button>

                    </Form>
                )
            }
            }
        </Formik>
    )
}

export default ModifyForm;