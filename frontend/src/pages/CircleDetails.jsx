import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import '../styles/CircleDetails.css';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CircleDetails = () => {
  const [userPaid, setUserPaid] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCircleDetails = async () => {
      try {
        console.log('Fetching circle details...');
        const response = await api.get('/circle-details/');
        console.log('Circle details:', response.data);
        setMembers(response.data.members || []);
        setUserPaid(response.data.userPaid || false);
      } catch (err) {
        console.error('Error fetching circle details:', err);
        // Fallback to mock data if API fails
        setMembers([
          { name: 'Vivian', hasPaid: true },
          { name: 'Daniel', hasPaid: false },
          { name: 'Ada', hasPaid: true },
          { name: 'Chuka', hasPaid: false }
        ]);
      }
    };
    fetchCircleDetails();
  }, []);

  const handleContribute = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      console.log('Making contribution...');
      const response = await api.post('/circle-contribute/', {
        amount: 1000,
        circleId: 'malaria-squad'
      });
      
      console.log('Contribution response:', response.data);
      setUserPaid(true);
      setMembers(prev =>
        prev.map(m => (m.name === 'Vivian' ? { ...m, hasPaid: true } : m))
      );
      setMessage('Contribution successful!');
    } catch (err) {
      console.error('Contribution error:', err);
      setMessage(err.response?.data?.message || 'Failed to make contribution. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrap">
      <Navbar />
      <div className="circle-detail-container">
        <h2>🧾 Malaria Squad Circle</h2>

        {message && (
          <div className={`circle-message ${message.includes('successful') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="circle-meta">
          <p><strong>Savings Amount:</strong> ₦1,000 / week</p>
          <p><strong>Next Deadline:</strong> Friday, June 28</p>
          <p>
            <strong>Your Status:</strong>{' '}
            <span className={userPaid ? 'paid' : 'unpaid'}>
              {userPaid ? 'Paid ✅' : 'Unpaid ❌'}
            </span>
          </p>
        </div>

        {!userPaid && (
          <button 
            className="contribute-btn" 
            onClick={handleContribute}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Contribute ₦1,000'}
          </button>
        )}

        <div className="member-section">
          <h3>Circle Members</h3>
          <ul>
            {members.map((member, index) => (
              <li key={index} className={member.hasPaid ? 'paid' : 'unpaid'}>
                {member.name} – {member.hasPaid ? 'Paid ✅' : 'Not Paid ❌'}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CircleDetails;