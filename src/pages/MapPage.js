import React, {useContext, useEffect, useState} from "react";
import {Map, MapLayer, Marker, Popup, TileLayer, withLeaflet} from "react-leaflet";
import "./MapStyle.css"
import { usePosition } from 'use-position';
import { Route, useHistory } from "react-router-dom";
import L from "leaflet";

function MyMap (props) {

    let history = useHistory();

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

    //go to the URL of one establishment and render the infos for it
    let callPathMap = async (id) => {
        /* Call backend with id, return all infos of establishment -> stock in a variable*/
        history.push("/location/" + id );
    }

    /*
    const myRoute = (
        L.Routing.control({
            waypoints: [
                L.latLng(latitude, longitude),
                L.latLng(46.2806238842186, 7.53847578)
            ],
            routeWhileDragging: true
        })
    )

    */

    /* Return Markers for each location around the user */
    const establishmentLocation  = (
        props.poi.map((value, index) => {
            return (
                <Marker key={index} position={[value.lat, value.lng]} onClick={() => callPathMap(value.id)}>
                    <Popup>
                        <code>
                            latitude: {value.lat}<br/>
                            longitude: {value.lng}<br/>
                            id: {value.id}<br/>
                        </code>
                    </Popup>
                </Marker>
            )
        })
    )

    //Position of the user
    const userPosition = (
        <Marker position={[latitude,longitude]} >
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
            {longitude && latitude ?
                <Map center={[latitude, longitude]} zoom={zoom}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>
                            contributors'
                    />
                    {userPosition}

                    {establishmentLocation}

                </Map> : <div>Getting geolocation...</div>
            }
        </div>
    );

};


export default MyMap;
