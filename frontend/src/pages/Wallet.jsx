import React from "react";
import "../styles/Wallet.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from 'react';


const WalletPage = () => {
  const [balance, setBalance] = useState(0);
  const [contributionHistory, setContributionHistory] = useState([]);

  const nextPayment = {
    amount: 1000,
    dueDate: "Friday, June 21",
  };
const handleTopUp = () => {
  const parsedAmount = parseFloat(topUpAmount);
  if (!isNaN(parsedAmount) && parsedAmount > 0) {
    setBalance(prev => prev + parsedAmount);
    setContributionHistory(prev => [
      { date: new Date().toLocaleDateString(), amount: parsedAmount, type: "Top-Up" },
      ...prev,
    ]);
    setTopUpAmount("");
    setShowTopUp(false);
  }
};

  const [showTopUp, setShowTopUp] = useState(false);
const [topUpAmount, setTopUpAmount] = useState("");
  return (
    <div className="wallet-container">
        <Navbar />
      <h1>My Wallet</h1>

      {/* Current Balance */}
      <div className="wallet-card">
        {/* Wallet Balance */}
<div className="wallet-card">
  <h2>Wallet Balance</h2>
  <p className="wallet-amount">₦{balance.toLocaleString()}</p>
  <button className="wallet-btn" onClick={() => setShowTopUp(true)}>Top Up</button>
</div>

{/* Top Up Form (shows only when toggled) */}
{showTopUp && (
  <div className="wallet-topup-form">
    <input
      type="number"
      placeholder="Enter amount"
      value={topUpAmount}
      onChange={(e) => setTopUpAmount(e.target.value)}
    />
    <button className="wallet-btn" onClick={handleTopUp}>Confirm Top Up</button>
    <button className="wallet-btn secondary" onClick={() => setShowTopUp(false)}>Cancel</button>
  </div>
)}
      </div>

      {/* Next Payment Suggestion */}
{/* Next Payment Suggestion */}
      <div className="wallet-nudge">
        <p>
          💡 You’re at risk of malaria. We suggest saving <strong>₦{nextPayment.amount}</strong> before{" "}
          <strong>{nextPayment.dueDate}</strong>.
        </p>
        <button className="wallet-btn secondary">Save Now</button>
      </div>

      {/* Contribution History */}
      <div className="wallet-history">
  <h3>Contribution History</h3>
  <ul>
    {contributionHistory.length === 0 ? (
      <li>No contributions yet.</li>
    ) : (
      contributionHistory.map((item, index) => (
        <li key={index}>
          {item.date} — ₦{item.amount.toLocaleString()} ({item.type})
        </li>
      ))
    )}
  </ul>
</div>
    </div>
  );
};

export default WalletPage;

      