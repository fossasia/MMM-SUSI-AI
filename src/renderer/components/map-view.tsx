/**
 * Created by betterclever on 24/7/17.
 */

import * as React from "react";
import {Map, Marker, Popup, TileLayer} from "react-leaflet";
interface IMapProps {
    latitude: number;
    longitude: number;
    zoom: number;
}

export class MapView extends React.Component<IMapProps, any> {

    public constructor(props: IMapProps) {
        super(props);
    }

    public render(): JSX.Element | any | any {
        const center = [this.props.latitude, this.props.longitude];
        console.log(center);
        return <Map center={center} zoom={this.props.zoom} style={{height: "300px"}}>
            <TileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                       attribution=""/>
            <Marker position={center}>
                <Popup>
                    <span> Here</span>
                </Popup>
            </Marker>
        </Map>;
    }
}
