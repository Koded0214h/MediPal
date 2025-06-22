import React, { useState } from 'react';
import '../styles/ProfilePage.css';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    fullName: 'Vivian Okafor',
    email: 'vivian@example.com',
    phone: '08012345678',
    age: '21',
    gender: 'Female',
    location: 'Lagos',
    conditions: ['Malaria']
  });

  const allConditions = ['Malaria', 'Hypertension', 'Asthma', 'Diabetes', 'None'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated Profile:', formData);
    alert('Profile updated successfully!');
  };

  return (
    <div className="wrap">
      <Navbar />
    <div className="profile-container">
      <h2>My Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input name="fullName" value={formData.fullName} onChange={handleChange} />

        <label>Email</label>
        <input value={formData.email} readOnly disabled />

        <label>Phone Number</label>
        <input name="phone" value={formData.phone} onChange={handleChange} />

        <label>Age</label>
        <input name="age" type="number" value={formData.age} onChange={handleChange} />

        <label>Gender</label>
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option>Female</option>
          <option>Male</option>
          <option>Other</option>
        </select>

        <label>Location</label>
        <input name="location" value={formData.location} onChange={handleChange} />

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

        <button type="submit">Update Profile</button>
      </form>
    </div>
    <Footer />
    </div>
  );
};

export default ProfilePage;