import React, { useState } from 'react';

function GeocodeComponent() {
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState(null);

  const geocode = async (address) => {
    const apiKey = 'AIzaSyCvwz9hrHRRu4e3xggr812sj63vFmOx1Zs'; // Replace with your API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === 'OK') {
        const { lat, lng } = data.results[0].geometry.location;
        setCoordinates({ lat, lng });
      } else {
        console.error('Geocoding API error:', data.status);
        setCoordinates(null);
      }
    } catch (error) {
      console.error('Error fetching geocode:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    geocode(address);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter a location"
        />
        <button type="submit">Geocode</button>
      </form>
      {coordinates && (
        <div>
          <h2>Coordinates</h2>
          <p>Latitude: {coordinates.lat}</p>
          <p>Longitude: {coordinates.lng}</p>
        </div>
      )}
    </div>
  );
}

export default GeocodeComponent;
