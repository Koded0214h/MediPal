import React from "react";
import "../styles/Dashboard.css";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
        <Navbar />
      <h1>Welcome back, Vivian!</h1>
      <p>Your next health milestone is in sight 🚀</p>

      <div className="card">
        <h3>💰 Wallet</h3>
        <p className="wallet-balance">₦2,000</p>
        <button className="btn"><a href="wallet">Top up</a></button>
      </div>

      <div className="card">
        <h3>🩺 Your Health Goal</h3>
        <p className="goal">Malaria Treatment Fund: ₦5,000</p>
        <button className="btn">Save Now</button>
      </div>

      <div className="card">
        <h3>🤖 Nudge from MediPal AI</h3>
        <p className="nudge">
          “Malaria risk is high this month in Lagos. Try to top up ₦1,000 to stay covered.”
        </p>
      </div>
      <div className="circle-actions">
  <h3>Your Circles</h3>
  <p>You’re part of 2 active health circles.</p>
  

</div>
  <div className="circle-btn-group">
    <Link to="/circle">
      <button className="primary-btn">➕ Create Circle</button>
    </Link>

    <Link to="/circle">
      <button className="secondary-btn">🔗 Join Circle</button>
    </Link>
  </div>
      <Footer />
    </div>
  );
};

export default Dashboard;