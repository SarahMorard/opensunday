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


function dayReducer(state, action) {
    switch (action.type) {
        case "add":
            return [...state, action.day];
        case "remove":
            const update = [...state];
            update.splice(update.indexOf(action.day, 1));
            return update;
        default:
            return state;
    }
}

//The Creation form (not done yet)
function ModifyForm(props) {

    const [selectedDay, setDays] = useReducer(dayReducer, props.Closed);

    const [lat, setLat] = useState(props.Lat);
    const [long, setLong] = useState(props.Lng);

    /* Const to keep track of the position of the user */
    const watch = true;

    /* Const for the position of the user */
    const {
        latitude,
        longitude
    } = usePosition(watch);

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
    ]; //29 options...

    const initialValues = {
        name: props.Name,
        type: props.IdType,
        description: props.Description,
        address: props.Address,
        npa: props.IdCity,
        city: props.City,
        website: props.WebSite,
    };

    const validationSchema = Yup.object({
        name: Yup.string().required("Required"),
        type: Yup.string().required("Required"),
        description: Yup.string().required("Required"),
        address: Yup.string().required("Required"),
        npa: Yup.string().required("Required"),
        city: Yup.string().required("Required"),
        website: Yup.string().required("Required"),
        lat: Yup.number().required("required"),
        long: Yup.number().required("Required")
    });

    const handleDayClick = (day) => {
        let isAlreadySelected = false;

        selectedDay.map((item, index) => {
                //console.log(item + "   " + day);
                if (item === day) {
                    isAlreadySelected = true;
                    //console.log("coucou")
                }
            }
        )
        console.log(isAlreadySelected);

        if (!isAlreadySelected) {
            setDays({day, type: "add"});
        } else {
            setDays({day, type: "remove"});
        }
        console.log(selectedDay)
    }

    const submitMethod = (value) => {
        console.log(value);
        //modify an establishment
    }

    const handleClickMap = (e) => {
        setLat(e.latlng.lat);
        setLong(e.latlng.lng);
    }

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
                        <DayPicker
                            className="calendarInForm"
                            onDayClick={handleDayClick}
                            selectedDays={selectedDay}
                        />
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
                        <button type="submit">Modify</button>
                    </Form>
                )
            }
            }
        </Formik>
    )
}

export default ModifyForm;