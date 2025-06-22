import React, { useState } from 'react';
import '../styles/ProvidersPage.css';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const ProvidersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const providers = [
    {
      name: 'Lifeline Clinic',
      type: 'Clinic',
      location: 'Yaba, Lagos',
      services: ['General Consultation', 'Malaria Treatment']
    },
    {
      name: 'HealthPlus Pharmacy',
      type: 'Pharmacy',
      location: 'Ikeja, Lagos',
      services: ['Drugs', 'BP Check', 'First Aid']
    },
    {
      name: 'MedHub Diagnostics',
      type: 'Diagnostic Center',
      location: 'Lekki, Lagos',
      services: ['Lab Tests', 'Scans', 'Malaria Screening']
    }
  ];

  const filtered = providers.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="wrap">
        <Navbar />
    <div className="provider-container">

      <h2>🩺 Nearby Healthcare Providers</h2>

      <input
        type="text"
        placeholder="Search clinic, pharmacy or location..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <div className="provider-list">
        {filtered.map((provider, index) => (
          <div key={index} className="provider-card">
            <h3>{provider.name}</h3>
            <p><strong>Type:</strong> {provider.type}</p>
            <p><strong>Location:</strong> {provider.location}</p>
            <p><strong>Services:</strong> {provider.services.join(', ')}</p>
            <button className="view-btn">Get Directions</button>
          </div>
        ))}
        {filtered.length === 0 && <p className="no-result">No providers found.</p>}
      </div>
    </div>
    </div>
  );
};

export default ProvidersPage;