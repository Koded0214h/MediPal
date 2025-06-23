import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    location: '',
    conditions: [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const allConditions = [
    'Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Arthritis', 'Depression', 'Anxiety'
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Fetching profile...');
        const response = await api.get('/profile/');
        console.log('Profile data:', response.data);
        setFormData(response.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setMessage('Failed to load profile data.');
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCheckbox = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      conditions: checked
        ? [...prev.conditions, value]
        : prev.conditions.filter(c => c !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      console.log('Updating profile:', formData);
      const response = await api.put('/profile/', formData);
      
      console.log('Profile update response:', response.data);
      setMessage('Profile updated successfully!');
    } catch (err) {
      console.error('Profile update error:', err);
      setMessage(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrap">
      <Navbar />
      <div className="profile-container">
        <h2>My Profile</h2>
        
        {message && (
          <div className={`profile-message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input 
            name="fullName" 
            value={formData.fullName} 
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input 
            value={formData.email} 
            readOnly 
            disabled 
          />

          <label>Phone Number</label>
          <input 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange}
            required
          />

          <label>Age</label>
          <input 
            name="age" 
            type="number" 
            value={formData.age} 
            onChange={handleChange}
            required
          />

          <label>Gender</label>
          <select 
            name="gender" 
            value={formData.gender} 
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>

          <label>Location</label>
          <input 
            name="location" 
            value={formData.location} 
            onChange={handleChange}
            required
          />

          <label>Health Conditions</label>
          <div className="checkbox-group">
            {allConditions.map(cond => (
              <label key={cond}>
                <input
                  type="checkbox"
                  value={cond}
                  checked={formData.conditions.includes(cond)}
                  onChange={handleCheckbox}
                />
                {cond}
              </label>
            ))}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;