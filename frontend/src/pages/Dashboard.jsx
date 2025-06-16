import React from "react";
import "../styles/Dashboard.css";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
        <Navbar />
      <h2>Welcome back, Vivian!</h2>
      <p>Your next health milestone is in sight 🚀</p>

      <div className="card">
        <h3>💰 Wallet</h3>
        <p className="wallet-balance">₦2,000</p>
        <button className="btn">Top up</button>
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
      <Footer />
    </div>
  );
};

export default Dashboard;