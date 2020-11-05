import React, {useContext, useEffect, useState, useRef} from "react";
import {Map, Marker, TileLayer} from "react-leaflet";
import "./MapStyle.css"
import { usePosition } from 'use-position';
import { useHistory } from "react-router-dom";
import {DateContext} from "../Context/DateContext";
import L from 'leaflet';
import Routing from "./Routing";

function MyMap (props) {

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
        longitude
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

    /* Customer pointer icon with the color Red */
    const pointerIconYellow = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });


    /* Return Markers for each location around the user
    *  When the establishment is open the marker is blue
    *  When the establishment is red the marker is red
    *  When th establishment is sponsorized the marker is orange
    * */
    const OpenEstablishmentLocation  = (
        props.ePoi.map((value, index) => {
            // Normal open establishments
            if (value.isSponsorized !== true) {
                return (
                    <Marker
                        key={index} position={[value.lat, value.lng]}
                        onClick={() => callPathMap(value.establishmentId)}

                    />
                )
            }else {
                //Sponsorized establishments
                return (
                    <Marker
                        key={index} position={[value.lat, value.lng]}
                        onClick={() => callPathMap(value.establishmentId)}
                        icon={pointerIconYellow}
                    />
                )
            }
        })
    )


    /* Const to diplays the closed establishement they are displayed with a red pointer */
    /* Normally, we should receive a list of string from the server, but the dates in the server are in
    * VisualStudio Date format, so it's not possible to match it with our calendar. We let this method
    * if someone want to continue the project and correct the backend*/
    const CloseEstablishmentLocation  = (
        props.ePoi.map((value, index) => {
            if (value.isOpen !== date) {
                return (
                    <Marker
                        key={index} position={[value.lat, value.lng]}
                        onClick={() => callPathMap(value.establishmentId)}
                        icon={pointerIconRed}
                    />
                )
            }
        })
    )

    //Position of the user
    const userPosition = (
        <Marker
            position={[latitude,longitude]}
            icon={pointerIconGreen}
        />
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

}


export default MyMap;
