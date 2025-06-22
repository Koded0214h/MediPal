import React from 'react';
import '../styles/Register.css'; // CSS file
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoginForm from '../components/LoginForm';


const Register = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add form handling logic (e.g., send data to backend)
    alert('Registration submitted!');
  };

  return (
    <div className="tired">
      <Navbar />
      <div className="register">
        <div className="img">
                          <h2 className="title">Welcome back✌️</h2>

          <LoginForm />
        </div>
        <div className="register-container">
          <h2>Create Your Medipal Account</h2>
          <form onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input type="text" name="fullname" required />

            <label>Email</label>
            <input type="email" name="email" required />

            <label>Phone Number</label>
            <input type="tel" name="phone" required />

            <label>Age</label>
            <input type="number" name="age" required />

            <label>Gender</label>
            <select name="gender" required>
              <option value="">Select</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>

            <label>Location</label>
            <input type="text" name="location" required />

            <label>Existing Conditions</label>
            <textarea name="conditions" placeholder="e.g. asthma, diabetes..." />

            <button type="submit"><a href="/quiz">Register</a></button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
