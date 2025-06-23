import React, { useState } from 'react';
import { FaClinicMedical, FaMapMarkerAlt, FaCapsules, FaFlask, FaDirections } from 'react-icons/fa';
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

  const getTypeIcon = (type) => {
    if (type === 'Clinic') return <FaClinicMedical className="provider-type-icon" />;
    if (type === 'Pharmacy') return <FaCapsules className="provider-type-icon" />;
    if (type === 'Diagnostic Center') return <FaFlask className="provider-type-icon" />;
    return null;
  };

  return (
    <div className="providers-main-bg">
      <Navbar />
      <div className="providers-flex-wrapper">
        <div className="providers-card">
          <div className="providers-card-header">
            <h2>Nearby Healthcare Providers</h2>
          </div>
          <input
            type="text"
            placeholder="Search clinic, pharmacy or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="providers-search-input"
          />
          <div className="providers-list">
            {filtered.map((provider, index) => (
              <div key={index} className="providers-provider-card">
                <div className="providers-provider-card-header">
                  {getTypeIcon(provider.type)}
                  <h3>{provider.name}</h3>
                </div>
                <p className="providers-provider-type"><strong>Type:</strong> {provider.type}</p>
                <p className="providers-provider-location"><FaMapMarkerAlt style={{marginRight: '0.3rem'}} /><strong>Location:</strong> {provider.location}</p>
                <p className="providers-provider-services"><strong>Services:</strong> {provider.services.join(', ')}</p>
                <button className="providers-view-btn"><FaDirections style={{marginRight: '0.4rem'}} />Get Directions</button>
              </div>
            ))}
            {filtered.length === 0 && <p className="providers-no-result">No providers found.</p>}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProvidersPage;