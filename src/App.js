import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DataTablePage from './DataTablePage';
import RecordAudioPage from './RecordAudioPage';
import Navigation from './Navigation';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<DataTablePage />} />
        <Route path="/record-audio" element={<RecordAudioPage />} />
      </Routes>
    </Router>
  );
}

export default App;
