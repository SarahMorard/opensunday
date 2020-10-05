import React from "react";
import {Map, Marker, Popup, TileLayer} from "react-leaflet";

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


    diplayInfos = () => {
        //Render the information about the establishment
    }

    render() {
        return (
            <Map center={[this.coord.lat, this.coord.lng]} zoom={this.coord.zoom}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>
                    contributors'
                />
                <Marker position={[this.coord.lat, this.coord.lng]} onClick={this.diplayInfos}>
                    <Popup>
                        <div>
                            <h2>TechnoPole!</h2>
                        </div>
                    </Popup>
                </Marker>
            </Map>
        );
    }
}

export default MyMap;
