import React, {useContext, useState} from "react";
import {Map, MapLayer, Marker, Popup, TileLayer, withLeaflet} from "react-leaflet";
import "./MapStyle.css"
import { usePosition } from 'use-position';
import InfosEstablishment from "../components/Infos/InfosEstablishmentComponents";
import { Route, useHistory } from "react-router-dom";


function MyMap (props) {

    //State for what to render in the infoEstablishment
    const [poi, setPoi] = useState({
        name: "",

    });

    let history = useHistory();

    /* Const for the zoom of the map */
    const zoom = 14;

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

    /* BRUTE CODE FOR TEST */
    const E1 = {
        eLat: 46.2806238842186,
        eLng: 7.53847578,
        eId: 1,
        eName: "Technopole"
    }

    const E2 = {
        eLat: 46.29062388,
        eLng: 7.5384757872227,
        eId: 2,
        eName: "lieu2"

    }

    const E3 = {
        eLat: 46.28623885,
        eLng: 7.538475787222,
        eId: 3,
        eName: "lieu3"
    }

    const E4 = {
        eLat: 46.2823883,
        eLng: 7.53847578722,
        eId: 4,
        eName: "lieu4"

    }

    //Const for the array of each establishment location
    const Establishments = ([
        E1, E2, E3, E4
    ]);

    //go to the URL of one establishment and render the infos for it
    let callPathMap = async (id) => {
        /* Call backend with id, return all infos of establishment -> stock in a variable*/
        history.push("/location/" + id )
    }

   /* Return Markers for each location around the user */
    const establishmentLocation  = (
        Establishments.map((value, index) => {

            return (
                <Marker key={index} position={[value.eLat, value.eLng]} onClick={() => callPathMap(value.eId)}>
                    <Popup>
                        <code>
                            latitude: {value.eLat}<br/>
                            longitude: {value.eLng}<br/>
                            id: {value.eId}<br/>
                        </code>
                    </Popup>
                </Marker>
            )
        })
    )

    //Position of the user
    const userPosition = (
        <Marker position={[latitude,longitude]}>
            <Popup>
                <code>
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
