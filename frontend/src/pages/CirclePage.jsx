import React, { useState } from "react";
import { FaUsers, FaMoneyBillWave, FaCalendarAlt, FaUserPlus, FaUserFriends, FaTimes } from "react-icons/fa";
import "../styles/CirclePage.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const CirclePage = () => {
  const navigate = useNavigate();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const [form, setForm] = useState({
    name: '',
    amount: '',
    frequency: 'Weekly',
    maxMembers: '',
  });

  const toggleCreateModal = () => setShowCreateModal(!showCreateModal);
  const toggleJoinModal = () => setShowJoinModal(!showJoinModal);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.amount || !form.maxMembers) {
      alert("Please fill all fields");
      return;
    }

    const newCircle = {
      id: Date.now().toString(),
      ...form,
      members: ["You"],
      contributions: [],
    };

    const circles = JSON.parse(localStorage.getItem("circles")) || [];
    circles.push(newCircle);
    localStorage.setItem("circles", JSON.stringify(circles));

    setShowCreateModal(false); // Close modal
    navigate(`/circle/${newCircle.id}`); // Redirect to detail page
  };

  return (
    <div className="circle-main-bg">
      <Navbar />
      <div className="circle-flex-wrapper">
        <div className="circle-card">
          <div className="circle-card-header">
            <FaUsers className="circle-card-icon" />
            <h2>Your Health Circles</h2>
          </div>
          <section className="circle-actions">
            <button className="circle-btn create" onClick={toggleCreateModal}><FaUserPlus style={{marginRight:'0.5rem'}} />Create Circle</button>
            <button className="circle-btn join" onClick={toggleJoinModal}><FaUserFriends style={{marginRight:'0.5rem'}} />Join Circle</button>
          </section>
          <section className="circle-list">
            <h3>Active Circles</h3>
            <div className="circle-list-cards">
              <div className="circle-list-card">
                <div className="circle-list-card-header"><FaUsers className="circle-list-card-icon" /><h4>Malaria Cover Squad</h4></div>
                <p><FaMoneyBillWave style={{marginRight:'0.3rem'}} />Saving: ₦1,000 weekly</p>
                <p><FaUserFriends style={{marginRight:'0.3rem'}} />Members: 6</p>
                <button className="circle-btn view">View</button>
              </div>
              <div className="circle-list-card">
                <div className="circle-list-card-header"><FaUsers className="circle-list-card-icon" /><h4>Hospital Bills Backup</h4></div>
                <p><FaMoneyBillWave style={{marginRight:'0.3rem'}} />Saving: ₦2,500 monthly</p>
                <p><FaUserFriends style={{marginRight:'0.3rem'}} />Members: 12</p>
                <button className="circle-btn view">View</button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Create Circle Modal */}
      {showCreateModal && (
        <div className="circle-modal">
          <div className="circle-modal-content">
            <button className="circle-modal-close" onClick={toggleCreateModal}><FaTimes /></button>
            <h3>Create New Health Circle</h3>
            <form onSubmit={handleSubmit} className="circle-modal-form">
              <label>Circle Name</label>
              <input name="name" value={form.name} onChange={handleChange} required />
              <label>Amount to Save (₦)</label>
              <input name="amount" type="number" value={form.amount} onChange={handleChange} required />
              <label>Frequency</label>
              <select name="frequency" value={form.frequency} onChange={handleChange}>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
              <label>Max Members</label>
              <input name="maxMembers" type="number" value={form.maxMembers} onChange={handleChange} required />
              <div className="circle-modal-buttons">
                <button type="submit" className="circle-btn create">Create</button>
                <button type="button" onClick={toggleCreateModal} className="circle-btn cancel">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Circle Modal */}
      {showJoinModal && (
        <div className="circle-modal">
          <div className="circle-modal-content">
            <button className="circle-modal-close" onClick={toggleJoinModal}><FaTimes /></button>
            <h3>Join a Circle</h3>
            <form className="circle-modal-form">
              <input type="text" placeholder="Enter Circle Code" required />
              <div className="circle-modal-buttons">
                <button type="submit" className="circle-btn join">Join</button>
                <button type="button" onClick={toggleJoinModal} className="circle-btn cancel">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CirclePage;