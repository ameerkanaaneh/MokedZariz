import React, { useState, useEffect } from 'react';
//import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import MapComponent from './MapComponent';
import locationsData from './data';
import '@fortawesome/fontawesome-free/css/all.min.css';

function DataTablePage() {
  const [data, setData] = useState([]);

  const geocode = async (location) => {
    const apiKey = 'AIzaSyCvwz9hrHRRu4e3xggr812sj63vFmOx1Zs'; // Replace with your API key
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
    const fetchCoordinates = async () => {
      const dataWithCoordinates = await Promise.all(locationsData.map(async (location) => {
        const coordinates = await geocode(location.location);
        return {
          ...location,
          coordinates,
        };
      }));
      setData(dataWithCoordinates);
    };
    fetchCoordinates();
  }, []);

  const deleteRow = (id) => {
    setData(data.filter(item => item.id !== id));
  };

  const columns = [
    {
      name: 'Case',
      selector: row => row.case,
    },
    {
      name: 'Voice Record',
      selector: row => row.voiceRecord,
      cell: row => <audio controls src={row.voiceRecord} />,
    },
    {
      name: 'Location',
      selector: row => row.location,
    },
    {
      name: 'Severity',
      selector: row => row.severity,
      sortable: true,
      sortFunction: (a, b) => a.severity - b.severity,
      id: 'severity',
    },
    {
      name: 'Reporting Time',
      selector: row => row.reportingTime,
      sortable: true,
      sortFunction: (a, b) => {
        const toMinutes = time => {
          const [hours, minutes] = time.split(':').map(Number);
          return hours * 60 + minutes;
        };
        return toMinutes(a.reportingTime) - toMinutes(b.reportingTime);
      },
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
        data={data}
        //selectableRows
        defaultSortFieldId='severity'
        defaultSortAsc={false}
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
