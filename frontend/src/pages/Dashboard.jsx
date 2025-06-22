import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import "../styles/Dashboard.css";
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [healthData, setHealthData] = useState(null);
    const [walletData, setWalletData] = useState(null);
    const [latestAiRecommendation, setLatestAiRecommendation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

<<<<<<< HEAD
      <div className="card">
        <h3>💰 Wallet</h3>
        <p className="wallet-balance">₦2,000</p>
        <button className="btn"><a href="wallet">Top up</a></button>
      </div>
=======
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [healthResponse, walletResponse] = await Promise.all([
                    api.get('/health-profile/'),
                    api.get('/wallet/')
                ]);
>>>>>>> ac921a2854fe2903dced47176e2c35fcd605d58f

                setUserData(healthResponse.data);
                setHealthData(healthResponse.data);
                setWalletData(walletResponse.data);

<<<<<<< HEAD
      <div className="card">
        <h3>🤖 Nudge from MediPal AI</h3>
        <p className="nudge">
          “Malaria risk is high this month in Lagos. Try to top up ₦1,000 to stay covered.”
        </p>
      </div>
      <div className="circle-actions">
  <h3>Your Circles</h3>
  <p>You’re part of 2 active health circles.</p>
  

</div>
  <div className="circle-btn-group">
    <Link to="/circle">
      <button className="primary-btn">➕ Create Circle</button>
    </Link>

    <Link to="/circle">
      <button className="secondary-btn">🔗 Join Circle</button>
    </Link>
  </div>
      <Footer />
    </div>
  );
=======
                // Fetch latest AI recommendation separately if needed, or integrate into health profile
                try {
                    const aiResponse = await api.get('/ai-recommendation/'); // Assuming you have a GET endpoint for latest AI rec
                    setLatestAiRecommendation(aiResponse.data);
                } catch (aiErr) {
                    console.warn("No AI recommendation found or failed to fetch AI recommendation", aiErr);
                    setLatestAiRecommendation(null);
                }

            } catch (err) {
                setError('Failed to load dashboard data');
                if (err.response?.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="dashboard-loader-container">
                <div className="spinner"></div>
                <p>Loading your MediPal Dashboard...</p>
            </div>
        );
    }

    if (error) {
        return <div className="dashboard-error">{error}</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-main-content">
                <header className="dashboard-header">
                    <h1>Welcome, {userData?.fullName || 'User'}</h1>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </header>

                <div className="dashboard-overview-grid">
                    <section className="health-summary card">
                        <h2>Health Summary</h2>
                        {healthData ? (
                            <div className="health-stats-grid">
                                <div className="stat-item">
                                    <h3>Age</h3>
                                    <p>{healthData.age || 'Not set'}</p>
                                </div>
                                <div className="stat-item">
                                    <h3>Gender</h3>
                                    <p>{healthData.gender || 'Not set'}</p>
                                </div>
                                <div className="stat-item">
                                    <h3>Location</h3>
                                    <p>{healthData.location || 'Not set'}</p>
                                </div>
                                <div className="stat-item full-width">
                                    <h3>Existing Conditions</h3>
                                    <p>{healthData.existing_conditions?.map(cond => cond.name).join(', ') || 'None'}</p>
                                </div>
                                {/* Add other health stats like BMI, BP, BS if available from healthData */}
                                <div className="stat-item">
                                    <h3>BMI</h3>
                                    <p>{healthData.bmi || 'Not set'}</p>
                                </div>
                                <div className="stat-item">
                                    <h3>Blood Pressure</h3>
                                    <p>{healthData.bloodPressure || 'Not set'}</p>
                                </div>
                                <div className="stat-item">
                                    <h3>Blood Sugar</h3>
                                    <p>{healthData.bloodSugar || 'Not set'}</p>
                                </div>
                            </div>
                        ) : (
                            <p>No health data available. <Link to="/health-profile-form">Complete your profile</Link></p>
                        )}
                    </section>

                    <section className="wallet-summary card">
                        <h2>💰 My Wallet</h2>
                        {walletData ? (
                            <>
                                <p className="wallet-balance">₦{walletData.balance !== undefined ? walletData.balance : '0.00'}</p>
                                {walletData.goal && <p className="wallet-goal">Goal: ₦{walletData.goal}</p>}
                                <button className="btn primary-btn">Top up</button>
                                {walletData.goal && !walletData.is_locked && (
                                    <button className="btn secondary-btn">Lock for Goal</button>
                                )}
                            </>
                        ) : (
                            <p>Wallet data not available.</p>
                        )}
                    </section>

                    <section className="ai-nudge card">
                        <h2>🤖 MediPal AI Nudge</h2>
                        {latestAiRecommendation ? (
                            <>
                                <p>{latestAiRecommendation.suggested_goals || 'No recent nudges.'}</p>
                                <small>Risk: {latestAiRecommendation.predicted_risk || 'N/A'}</small>
                            </>
                        ) : (
                            <p>No AI nudges available yet.</p>
                        )}
                    </section>
                </div>

                <div className="dashboard-bottom-sections-grid">
                    <section className="recent-activity card">
                        <h2>Recent Activity</h2>
                        <p>No recent activity.</p>
                        {/* Add your activity list here */}
                    </section>

                    <section className="upcoming-appointments card">
                        <h2>Upcoming Appointments</h2>
                        <p>No upcoming appointments.</p>
                        {/* Add your appointments list here */}
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
>>>>>>> ac921a2854fe2903dced47176e2c35fcd605d58f
};

export default Dashboard;