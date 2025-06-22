import React, { useState } from "react";
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
    <div className="circle-page">
      <Navbar />
      <h2 className="circle-heading">Your Health Circles</h2>

      <section className="circle-actions">
        <button className="btn create" onClick={toggleCreateModal}>+ Create Circle</button>
        <button className="btn join" onClick={toggleJoinModal}>Join Circle</button>
      </section>

      <section className="circle-list">
        <h3>Active Circles</h3>

        <div className="circle-card">
          <h4>Malaria Cover Squad</h4>
          <p>Saving: ₦1,000 weekly</p>
          <p>Members: 6</p>
          <button className="btn view"><a href="/circledet">View</a></button>
        </div>

        <div className="circle-card">
          <h4>Hospital Bills Backup</h4>
          <p>Saving ₦2,500 monthly</p>
          <p>Members: 12</p>
          <button className="btn view">View</button>
        </div>
      </section>

      {/* ✅ Create Circle Modal with Functional Form */}
      {showCreateModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create New Health Circle</h3>
            <form onSubmit={handleSubmit}>
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

              <div className="modal-buttons">
                <button type="submit" className="btn create tap">Create</button>
                <button type="button" onClick={toggleCreateModal} className="btn cancel tip">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Join Circle Modal */}
      {showJoinModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Join a Circle</h3>
            <form>
              <input type="text" placeholder="Enter Circle Code" required />
              <button type="submit" className="btn join">Join</button>
              <button type="button" onClick={toggleJoinModal} className="btn cancel">Cancel</button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CirclePage;