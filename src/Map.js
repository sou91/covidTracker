import React from 'react';
import {MapContainer, TileLayer, useMap } from 'react-leaflet';
import './Map.css';
import {showDataOnMap} from '../src/util';
function Map({countries,center,zoom, casesType}) {
    function ChangeView({ center, zoom }) {
        const map = useMap();
        map.setView(center, zoom);
        return null;
      }
    return (
        <div className="map">
            {center[0]}
            <MapContainer center={center} zoom={zoom}>
            <ChangeView center={center} zoom={zoom} />
                <TileLayer
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                attribution='&copy; <a href="http://osm.org/copyright">
                OpenStreetMap</a> contributors'></TileLayer>
            {showDataOnMap(countries, casesType)}
            </MapContainer>
        </div>
    )
}

export default Map
