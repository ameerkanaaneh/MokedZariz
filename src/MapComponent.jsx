import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 31.2521,
  lng: 34.7868,
};

const MapComponent = ({ locations }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: 'AIzaSyCvwz9hrHRRu4e3xggr812sj63vFmOx1Zs', // Your API Key
      version: 'weekly',
      libraries: ['marker'],
    });

    loader.load().then(() => {
      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 8,
        mapId: '7e37ab1b7d5d8471', // Replace with your actual Map ID
      });

      locations.forEach((loc) => {
        new window.google.maps.marker.AdvancedMarkerElement({
          map,
          position: loc.coordinates,
          title: loc.label,
          //icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
        });
      });
    });
  }, [locations]);

  return <div ref={mapRef} style={mapContainerStyle} />;
};

export default MapComponent;
