import React, {useContext, useState} from "react";
import {Map, Marker, Popup, TileLayer} from "react-leaflet";
import "./MapStyle.css"

import { usePosition } from 'use-position';

function MyMap (props) {
    //Const to keep track of the position of the user
    const watch = true;

    //Const for the position
    const {
        latitude,
        longitude,
        timestamp,
        accuracy,
        error,
    } = usePosition(watch);

    //Const for the array of each establishment location
    const Establishments = ([
        [46.2806238842186, 7.53847578],
        [46.29062388, 7.5384757872227],
        [46.28623885, 7.538475787222],
        [46.2823883, 7.53847578722],
        [46.2838842186, 7.538475787222],
        [46.28388421, 7.53847],
        [46.2930623884218, 7.5384],
    ]);

    //Return Markers for each location around the user
    const establishmentLocation  = (
        Establishments.map((value, index) => {
            return <Marker key={index} position={value} onClick={props.toggleChangeDisplay}/>
        })
    )

    //Position of the user
    const userPosition = (
        <Marker position={[latitude,longitude]} onClick={props.toggleChangeDisplay}>
            <Popup>
                <code>
                    latitude: {latitude}<br/>
                    longitude: {longitude}<br/>
                    timestamp: {timestamp}<br/>
                    accuracy: {accuracy && `${accuracy}m`}<br/>
                    error: {error}
                </code>
            </Popup>
        </Marker>
    );


    /* When the page load the latitude and longitude aren't necessarily loaded yet*/
    return (

        <div className="Map">

            {longitude && latitude ?
                <Map center={[latitude, longitude]} zoom={14}>
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
