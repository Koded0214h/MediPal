import React, { useState } from 'react';
import '../styles/CircleDetails.css';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const CircleDetails = () => {
  const [userPaid, setUserPaid] = useState(false);
  const [members, setMembers] = useState([
    { name: 'Vivian', hasPaid: true },
    { name: 'Daniel', hasPaid: false },
    { name: 'Ada', hasPaid: true },
    { name: 'Chuka', hasPaid: false }
  ]);

  const handleContribute = () => {
    setUserPaid(true);
    setMembers(prev =>
      prev.map(m => (m.name === 'Vivian' ? { ...m, hasPaid: true } : m))
    );
    alert('Contribution successful!');
  };

  return (
    <div className="wrap">

      <Navbar />
    <div className="circle-detail-container">
      <h2>🧾 Malaria Squad Circle</h2>

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
        <button className="contribute-btn" onClick={handleContribute}>
          Contribute ₦1,000
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