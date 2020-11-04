import React, {useContext, useEffect, useState, useRef} from "react";
import {Map, MapLayer, Marker, Popup, TileLayer, withLeaflet} from "react-leaflet";
import "./MapStyle.css"
import { usePosition } from 'use-position';
import { Route, useHistory } from "react-router-dom";
import {DateContext} from "../Context/DateContext";
import L from 'leaflet';
import Routing from "./Routing";

function MyMap (props) {


    /* State for the day that was  clicked on the calendar*/
    const [day, selectedDay] = useState(undefined);

    /* Use history to push the paths */
    let history = useHistory();

    /* Date Context */
    const {date} = useContext(DateContext);
    
    const [eLatLng, setLatLng] = useState(null);

    //const for the render of the map
    const [lat, setlat] = useState(null);
    const [long, setlong] = useState(null)

    /* Const for the zoom of the map */
    const zoom = 14;

    /* Const to keep track of the position of the user */
    const watch = true;

    /* Const for the position of the user */
    const {
        latitude,
        longitude,
        timestamp,
        accuracy,
        error,
    } = usePosition(watch);

    const mapRef = useRef();

    /*set lat and long which don't rerender the map (if we set the map with longitude and latitude,
      at each change of these variables, the map rerender)
    */
    useEffect(() => {
        if(latitude!=null && longitude!=null && lat===null) {
            setlat(latitude);
            setlong(longitude);
        }
    }, [latitude]);

    //go to the URL of one establishment and render the infos for it
    let callPathMap = async (id) => {
        /* Call backend with id, return all infos of establishment -> stock in a variable*/
        history.push("/location/" + id );

        let myRoute = props.ePoi.find(e => e.establishmentId === id);
        setLatLng([myRoute.lat, myRoute.lng]);
    }


    // Set the day that was retrieved from the calendar when the user click on a day
    const setDay = () =>{
        selectedDay(props.day)
    }


    /* Customer pointer icon with the color Green */
    const pointerIconGreen = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });


    /* Customer pointer icon with the color Red */
    const pointerIconRed = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });


    /* Return Markers for each location around the user
    *  When the establishment is open the marker is blue
    *  When the establishment is red the marker is red
    *  When it's not really defined the marker is orange
    * */
    const OpenEstablishmentLocation  = (
        props.ePoi.map((value, index) => {
                return (
                    <Marker
                        key={index} position={[value.lat, value.lng]}
                        onClick={() => callPathMap(value.establishmentId)}
                    >
                    </Marker>
                )
        })
    )


    //Position of the user
    const userPosition = (
        <Marker
            position={[latitude,longitude]}
            icon={pointerIconGreen}
        >
            <Popup>
                <code>
                    Your current position is:<br/>
                    latitude: {latitude}<br/>
                    longitude: {longitude}<br/>
                    timestamp: {timestamp}<br/>
                    accuracy: {accuracy && `${accuracy}m`}<br/>
                    error: {error}<br/>
                </code>
            </Popup>
        </Marker>
    );


    /* When the page load the latitude and longitude aren't necessarily loaded yet*/
    return (
        <div className="Map">
            {long && lat ?
                <Map
                    center={[lat, long]}
                    zoom={zoom}
                    ref={mapRef}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>
                            contributors'

                    />
                    {userPosition}

                    {OpenEstablishmentLocation}

                    {setDay}


                    {mapRef.current && eLatLng &&
                        <Routing
                            map={mapRef.current}
                            lat={latitude}
                            lng={longitude}
                            eLatLng={eLatLng}
                        />
                    }
                </Map> : <div>Getting geolocation...</div>
            }
        </div>
    );

};


export default MyMap;
