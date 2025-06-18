import React, { useState } from "react";
import "../styles/CirclePage.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CirclePage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const toggleCreateModal = () => setShowCreateModal(!showCreateModal);
  const toggleJoinModal = () => setShowJoinModal(!showJoinModal);

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
          <button className="btn view">View</button>
        </div>

        <div className="circle-card">
          <h4>Hospital Bills Backup</h4>
          <p>Saving ₦2,500 monthly</p>
          <p>Members: 12</p>
          <button className="btn view">View</button>
        </div>
      </section>

      {/* Create Circle Modal */}
      {showCreateModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create a New Circle</h3>
            <form>
              <input type="text" placeholder="Circle Name" required />
              <input type="number" placeholder="Amount to Save (₦)" required />
              <input type="number" placeholder="Frequency (days)" required />
              <button type="submit" className="btn create">Create</button>
              <button onClick={toggleCreateModal} className="btn cancel">Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Join Circle Modal */}
      {showJoinModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Join a Circle</h3>
            <form>
              <input type="text" placeholder="Enter Circle Code" required />
              <button type="submit" className="btn join">Join</button>
              <button onClick={toggleJoinModal} className="btn cancel">Cancel</button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CirclePage;