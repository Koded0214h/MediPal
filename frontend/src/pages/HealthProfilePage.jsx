import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import Footer from '../components/Footer';
import { FaHeartbeat, FaUser, FaMapMarkerAlt, FaNotesMedical } from 'react-icons/fa';
import '../styles/HealthProfile.css';

const HealthProfilePage = () => {
  const [profile, setProfile] = useState({
        age: '',
        gender: '',
        location: '',
    existing_conditions: '',
    });
  const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
        const res = await api.get('/health-profile/');
        setProfile({
          age: res.data.age || '',
          gender: res.data.gender || '',
          location: res.data.location || '',
          existing_conditions: res.data.existing_conditions?.map(c => c.name).join(', ') || '',
        });
            } catch (err) {
        setError('Failed to load health profile');
      } finally {
        setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
    setSuccess('');
    try {
      await api.post('/health-profile/', {
        age: profile.age,
        gender: profile.gender,
        location: profile.location,
        existing_conditions: profile.existing_conditions
          ? profile.existing_conditions.split(',').map(c => c.trim())
          : [],
      });
      setSuccess('Profile updated successfully!');
        } catch (err) {
      setError('Failed to update profile. Please try again.');
        }
    };

  if (loading) {
    return <div className="health-profile-loader">Loading...</div>;
  }

    return (
    <div className="health-profile-main-bg health-profile-flex-wrapper">
      <div className="health-profile-card">
        <div className="health-profile-card-header">
          <div className="health-profile-card-icon"><FaHeartbeat size={32} /></div>
          <h2>Health Profile</h2>
        </div>
        <form className="health-profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="age"><FaUser style={{ marginRight: 8 }} />Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={profile.age}
              onChange={handleChange}
              min="0"
              placeholder="Enter your age"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="gender"><FaUser style={{ marginRight: 8 }} />Gender</label>
            <select
              id="gender"
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="location"><FaMapMarkerAlt style={{ marginRight: 8 }} />Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={profile.location}
              onChange={handleChange}
              placeholder="Enter your location"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="existing_conditions"><FaNotesMedical style={{ marginRight: 8 }} />Existing Conditions</label>
            <input
              type="text"
              id="existing_conditions"
              name="existing_conditions"
              value={profile.existing_conditions}
              onChange={handleChange}
              placeholder="e.g. asthma, diabetes, ..."
            />
          </div>
          {error && <div className="health-profile-error">{error}</div>}
          {success && <div className="health-profile-success">{success}</div>}
          <button className="health-profile-btn" type="submit">Update Profile</button>
        </form>
      </div>
      <Footer />
        </div>
    );
};

export default HealthProfilePage; 