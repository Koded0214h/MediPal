import React, { useState } from 'react';
import "../styles/HealthQuiz.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const HealthQuizForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    location: '',
    conditions: [],
    lifestyle: {
      smoking: '',
      alcohol: '',
      exercise: ''
    }
  });

  const medicalConditions = ['Diabetes', 'Hypertension', 'Asthma', 'Cancer', 'None'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.lifestyle) {
      setFormData(prev => ({
        ...prev,
        lifestyle: {
          ...prev.lifestyle,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      conditions: checked
        ? [...prev.conditions, value]
        : prev.conditions.filter(cond => cond !== value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted:', formData);
    // Send to backend or show confirmation
  };

  return (
    <div className="form-quiz">
        <Navbar />
    <form className="health-quiz-form" onSubmit={handleSubmit}>
      <h2>Health Quiz</h2>

      <label>Full Name</label>
      <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />

      <label>Age</label>
      <input type="number" name="age" value={formData.age} onChange={handleChange} required />

      <label>Gender</label>
      <select name="gender" value={formData.gender} onChange={handleChange} required>
        <option value="">Select Gender</option>
        <option>Female</option>
        <option>Male</option>
        <option>Other</option>
      </select>

      <label>Location</label>
      <input type="text" name="location" value={formData.location} onChange={handleChange} required />

      <label>Existing Conditions</label>
      <div className="checkbox-group">
        {medicalConditions.map((cond) => (
          <label key={cond}>
            <input
              type="checkbox"
              value={cond}
              checked={formData.conditions.includes(cond)}
              onChange={handleCheckboxChange}
            />
            {cond}
          </label>
        ))}
      </div>

      <label>Do you smoke?</label>
      <select name="smoking" value={formData.lifestyle.smoking} onChange={handleChange}>
        <option value="">Select</option>
        <option>Yes</option>
        <option>No</option>
      </select>

      <label>Do you drink alcohol?</label>
      <select name="alcohol" value={formData.lifestyle.alcohol} onChange={handleChange}>
        <option value="">Select</option>
        <option>Yes</option>
        <option>No</option>
      </select>

      <label>Do you exercise regularly?</label>
      <select name="exercise" value={formData.lifestyle.exercise} onChange={handleChange}>
        <option value="">Select</option>
        <option>Yes</option>
        <option>No</option>
      </select>

      <button type="submit">Submit Quiz</button>
    </form>
    <Footer />
    </div>
  );
};

export default HealthQuizForm;