import React, {useReducer, useState} from "react";
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

//The Creation form
function CreationForm() {

    //this reducer is a state for manage lists.
    const [selectedDay, setDays] = useReducer(dayReducer, []);

    //states for get back the latitude and the longitude
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);

    // Const to keep track of the position of the user
    const watch = true;

    // Const for the position of the user
    const {
        latitude,
        longitude
    } = usePosition(watch);

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
        name: "",
        type: "",
        description: "",
        address: "",
        npa: "",
        city: "",
        website: "",
    };

    //the yup validation schema
    const validationSchema = Yup.object({
        name: Yup.string().required("Required"),
        type: Yup.string().required("Required"),
        description: Yup.string().required("Required"),
        address: Yup.string().required("Required"),
        npa: Yup.string().required("Required"),
        city: Yup.string().required("Required"),
        website: Yup.string().required("Required"),
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

    //the effect of the submit button
    const submitMethod = async (value) => {

        //creation of the data
        const data = {
            name: value.name,
            description: value.description,
            address: value.address,
            website: value.website,
            lat: lat,
            lng: long,
            isSponsorized: false,
            city: {
                postalCode: value.npa,
                name: value.city
            },
            type: {
                id: value.type
            },
            //date format don't match from frontend to backend (frontend is strings and backend are VisualStudio dates objects)
            establishmentDates: []
        }

        //sent the POST request
        await Request(
            `${process.env.REACT_APP_SERVER_URL}${endpoints.establishments}`,
            getAccessTokenSilently,
            loginWithRedirect,
            "POST",
            data
        );

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

                        {/*if the user selected a place, render the submit button, if not, please the user for do it*/}
                        {lat!=null && long!=null ? <button type="submit">Submit</button> : <p>Please, select a place before you can submit</p>}
                    </Form>
                )
            }
            }
        </Formik>
    )
}

export default CreationForm;