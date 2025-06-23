import React, { useEffect, useState } from "react";
import { FaWallet, FaMoneyBillWave, FaLightbulb, FaPlus, FaHistory, FaTimes } from "react-icons/fa";
import "../styles/Wallet.css";
import Footer from "../components/Footer";
import api from '../utils/axios';

const WalletPage = () => {
  const [balance, setBalance] = useState(0);
  const [contributionHistory, setContributionHistory] = useState([]);
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch wallet balance from backend
    const fetchWallet = async () => {
      try {
        const response = await api.get('/wallet/');
        setBalance(response.data.balance || 0);
        // Optionally, set goal, is_locked, etc. from response
      } catch (err) {
        setError("Failed to fetch wallet data");
      }
    };
    fetchWallet();
  }, []);

  const handleTopUp = async () => {
    const parsedAmount = parseFloat(topUpAmount);
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      try {
        await api.post('/wallet/topup/', { amount: parsedAmount });
        setBalance(prev => prev + parsedAmount); // Optimistic update
        setContributionHistory(prev => [
          { date: new Date().toLocaleDateString(), amount: parsedAmount, type: "Top-Up" },
          ...prev,
        ]);
        setTopUpAmount("");
        setShowTopUp(false);
      } catch (err) {
        setError("Top up failed. Please try again.");
      }
    }
  };

  const nextPayment = {
    amount: 1000,
    dueDate: "Friday, June 21",
  };

  return (
    <div className="wallet-main-bg">
      <div className="wallet-flex-wrapper">
        <div className="wallet-card wallet-balance-card">
          <div className="wallet-card-header">
            <div className="wallet-card-icon"><FaWallet /></div>
            <h2>Wallet Balance</h2>
          </div>
          <p className="wallet-amount">₦{balance.toLocaleString()}</p>
          <button className="wallet-btn" onClick={() => setShowTopUp(true)}><FaPlus style={{marginRight:'0.5rem'}} />Top Up</button>
        </div>
        {showTopUp && (
          <div className="wallet-modal">
            <div className="wallet-modal-content">
              <button className="wallet-modal-close" onClick={() => setShowTopUp(false)}><FaTimes /></button>
              <h3>Top Up Wallet</h3>
              <input
                type="number"
                placeholder="Enter amount"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                className="wallet-input"
              />
              <div className="wallet-modal-buttons">
                <button className="wallet-btn" onClick={handleTopUp}>Confirm Top Up</button>
                <button className="wallet-btn secondary" onClick={() => setShowTopUp(false)}>Cancel</button>
              </div>
              {error && <div className="wallet-error">{error}</div>}
            </div>
          </div>
        )}
        <div className="wallet-card wallet-nudge-card">
          <div className="wallet-card-header">
            <div className="wallet-card-icon wallet-nudge-icon"><FaLightbulb /></div>
            <h2>AI Nudge</h2>
          </div>
          <p className="wallet-nudge-text">
            💡 You're at risk of malaria. We suggest saving <strong>₦{nextPayment.amount}</strong> before <strong>{nextPayment.dueDate}</strong>.
          </p>
          <button className="wallet-btn secondary">Save Now</button>
        </div>
        <div className="wallet-card wallet-history-card">
          <div className="wallet-card-header">
            <div className="wallet-card-icon wallet-history-icon"><FaHistory /></div>
            <h2>Contribution History</h2>
          </div>
          <ul className="wallet-history-list">
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
      <Footer />
    </div>
  );
};

export default WalletPage;

      