import React, { useState } from 'react';
import api from '../utils/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Settings.css';

const SettingsPage = () => {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [nudgeEnabled, setNudgeEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      console.log('Changing password...');
      const response = await api.post('/change-password/', {
        old_password: oldPass,
        new_password: newPass,
      });
      
      console.log('Password change response:', response.data);
      setMessage('Password updated successfully!');
      setOldPass('');
      setNewPass('');
    } catch (err) {
      console.error('Password change error:', err);
      setMessage(err.response?.data?.message || 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirmed) {
      setLoading(true);
      try {
        console.log('Deleting account...');
        const response = await api.delete('/delete-account/');
        
        console.log('Account deletion response:', response.data);
        localStorage.removeItem('token');
        window.location.href = '/';
      } catch (err) {
        console.error('Account deletion error:', err);
        setMessage(err.response?.data?.message || 'Failed to delete account. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleNudgeToggle = async () => {
    try {
      console.log('Toggling AI nudges...');
      const response = await api.post('/toggle-nudges/', {
        enabled: !nudgeEnabled,
      });
      
      console.log('Nudge toggle response:', response.data);
      setNudgeEnabled(!nudgeEnabled);
    } catch (err) {
      console.error('Nudge toggle error:', err);
      setMessage(err.response?.data?.message || 'Failed to update AI nudges setting.');
    }
  };

  return (
    <div className="wrap">
      <Navbar />
      <div className="settings-container">
        <h2>⚙ Settings</h2>
        
        {message && (
          <div className={`settings-message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <section>
          <h3>🔐 Change Password</h3>
          <form onSubmit={handlePasswordChange}>
            <label>Old Password</label>
            <input 
              type="password" 
              value={oldPass} 
              onChange={(e) => setOldPass(e.target.value)}
              required
            />

            <label>New Password</label>
            <input 
              type="password" 
              value={newPass} 
              onChange={(e) => setNewPass(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </section>

        <section>
          <h3>🔔 AI Nudges</h3>
          <div className="toggle-row">
            <label>Enable Health Suggestions</label>
            <input
              type="checkbox"
              checked={nudgeEnabled}
              onChange={handleNudgeToggle}
            />
          </div>
        </section>

        <section className="danger">
          <h3>🗑 Delete Account</h3>
          <button 
            onClick={handleDeleteAccount} 
            className="danger-btn"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete My Account'}
          </button>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default SettingsPage;