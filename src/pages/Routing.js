import { MapLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import { withLeaflet } from "react-leaflet";

class Routing extends MapLayer {
    createLeafletElement() {
        const { map } = this.props;
        let leafletElement = L.Routing.control({
            waypoints: [L.latLng(this.props.lat, this.props.lng), L.latLng(this.props.eLatLng)]


        }).addTo(map.leafletElement);
        return leafletElement.getPlan();
    }

   updateLeafletElement (prevProps, newProps){
        if(prevProps.eLatLng[0] !== newProps.eLatLng[0]) {
            this.leafletElement.setWaypoints([[newProps.lat, newProps.lng],newProps.eLatLng]);
        }
    }
}
export default withLeaflet(Routing);