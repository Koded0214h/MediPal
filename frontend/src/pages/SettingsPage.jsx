import React, { useState } from 'react';
import '../styles/Settings.css';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SettingsPage = () => {
  const [nudgeEnabled, setNudgeEnabled] = useState(true);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');

  const handlePasswordChange = (e) => {
    e.preventDefault();
    alert('Password updated successfully!');
    setOldPass('');
    setNewPass('');
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm('Are you sure you want to delete your account?');
    if (confirmed) {
      alert('Account deleted (simulated)');
    }
  };

  return (
    <div className="wrap">
      <Navbar />
    <div className="settings-container">
      <h2>⚙ Settings</h2>

      <section>
        <h3>🔐 Change Password</h3>
        <form onSubmit={handlePasswordChange}>
          <label>Old Password</label>
          <input type="password" value={oldPass} onChange={(e) => setOldPass(e.target.value)} />

          <label>New Password</label>
          <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} />

          <button type="submit">Update Password</button>
        </form>
      </section>

      <section>
        <h3>🔔 AI Nudges</h3>
        <div className="toggle-row">
          <label>Enable Health Suggestions</label>
          <input
            type="checkbox"
            checked={nudgeEnabled}
            onChange={() => setNudgeEnabled(!nudgeEnabled)}
          />
        </div>
      </section>

      <section className="danger">
        <h3>🗑 Delete Account</h3>
        <button onClick={handleDeleteAccount} className="danger-btn">Delete My Account</button>
      </section>
    </div>
    <Footer />
    </div>
  );
};

export default SettingsPage;