import React, { useState, useEffect } from 'react';
//import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import MapComponent from './MapComponent';
import {fetchCases} from './data';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Await } from 'react-router-dom';


function DataTablePage() {
  const [data, setData] = useState([]);

  const geocode = async (location) => {
    const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === 'OK') {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
      } else {
        console.error('Geocoding API error:', data.status);
        return null;
      }
    } catch (error) {
      console.error('Error fetching geocode:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchCoordinates = async (data) => {
      return await Promise.all(data.map(async (location) => {
        const coordinates = await geocode(location.location);
        return {
          ...location,
          coordinates,
        };
      }));
    };

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3002/uploads');
        const rawData = await response.json();
        const dataWithCoordinates = await fetchCoordinates(rawData);
        setData(dataWithCoordinates);
        console.log(dataWithCoordinates)
      } catch (error) {
        console.error('Error fetching cases:', error);
      }
    };

    fetchData();
  }, []);

  const deleteRow = (id) => {
    setData(data.filter(item => item.id !== id));
  };

  const columns = [
    {
      name: 'Case',
      selector: row => row.text,
    },
    {
      name: 'Voice Record',
      selector: row => row.voice,
      cell: row => <audio controls src={`http://localhost:3002/uploads/${row.voice}`} />,
    },
    {
      name: 'Latitude',
      selector: row => row.gpsCoords.latitude,
    },
    {
      name: 'Longitude',
      selector: row => row.gpsCoords.longitude,
    },
    {
      name: 'Severity',
      selector: row => row.score,
      sortable: true,
      sortFunction: (a, b) => a.score - b.score,
      id: 'score',
    },
    {
      name: 'Actions',
      cell: row => (
        <button onClick={() => deleteRow(row.id)} className="btn btn-danger">
          <i className="fas fa-trash-alt"></i>
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ];

  return (
    <div className='container mt-5'>
       <DataTable
        columns={columns}
          
        data={data.sort((a, b) => a.score - b.score) }
        //selectableRows
        defaultSortFieldId='Severity'
        defaultSortAsc={true}
        pagination
        fixedHeader
      />
      <MapComponent locations={data.map(item => ({
        coordinates: item.coordinates,
        label: item.case
      }))} />
    </div>
  );
}

export default DataTablePage;
