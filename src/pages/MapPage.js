import React from "react";
import {Map, Marker, Popup, TileLayer} from "react-leaflet";
import "./MapStyle.css"
import NavBars from "../components/Header/NavigationComponents";
import InfosEstablishment from "../components/Infos/InfosEstablishmentComponents";


class MyMap extends React.Component {
    constructor() {
        super();
        //Coordinates of the establisment location
        this.coord = {
            lat: 46.28306238842186,
            lng: 7.5387810396194554,
            zoom: 12
        }
    }


    displayInfos = () => {
        //Render the information about the establishment
        return <InfosEstablishment />;
    }


    render() {
        return (
            <div class="Map">
                <Map center={[this.coord.lat, this.coord.lng]} zoom={this.coord.zoom}>

                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>
                        contributors'
                    />
                    <Marker position={[this.coord.lat, this.coord.lng]} onClick={this.displayInfos}>

                    </Marker>
                </Map>
            </div>
        );
    }
}

export default MyMap;
