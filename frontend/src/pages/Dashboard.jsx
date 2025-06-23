import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import Footer from '../components/Footer';
import { FaWallet, FaHeartbeat, FaRobot, FaUserCircle, FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [healthData, setHealthData] = useState(null);
    const [walletData, setWalletData] = useState(null);
    const [latestAiRecommendation, setLatestAiRecommendation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [healthResponse, walletResponse] = await Promise.all([
                    api.get('/health-profile/'),
                    api.get('/wallet/'),
                ]);
                setUserData(healthResponse.data);
                setHealthData(healthResponse.data);
                setWalletData(walletResponse.data);
                try {
                    const aiResponse = await api.get('/ai-recommendation/');
                    setLatestAiRecommendation(aiResponse.data);
                } catch (aiErr) {
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
        <div className="dashboard-main-bg dashboard-flex-wrapper">
            <div className="dashboard-header-row dashboard-header-centered">
                <div className="dashboard-user-info dashboard-user-info-centered">
                    <FaUserCircle size={60} color="#4CAF50" style={{ marginBottom: 8 }} />
                    <h1>{userData?.fullName || 'User'}</h1>
                    <p className="dashboard-user-email">{userData?.email}</p>
                </div>
                <button className="dashboard-logout-icon-btn" onClick={handleLogout} title="Logout">
                    <FaSignOutAlt size={22} />
                </button>
            </div>
            <div className="dashboard-grid">
                {/* Wallet Card */}
                <div className="dashboard-card wallet-card">
                    <div className="dashboard-card-header">
                        <div className="dashboard-card-icon wallet-icon-bg"><FaWallet size={28} /></div>
                        <h2>Wallet</h2>
                    </div>
                    <div className="wallet-balance-highlight">₦{walletData?.balance !== undefined ? walletData.balance : '0.00'}</div>
                    {walletData?.goal && <div className="wallet-goal">Goal: ₦{walletData.goal}</div>}
                    <Link to="/wallet" className="dashboard-btn dashboard-btn-primary">Top up</Link>
                </div>
                {/* Health Card */}
                <div className="dashboard-card health-card">
                    <div className="dashboard-card-header">
                        <div className="dashboard-card-icon health-icon-bg"><FaHeartbeat size={28} /></div>
                        <h2>Health</h2>
                    </div>
                    {healthData ? (
                        <div className="health-stats-grid">
                            <div className="stat-item"><span>Age</span><div>{healthData.age || 'Not set'}</div></div>
                            <div className="stat-item"><span>Gender</span><div>{healthData.gender || 'Not set'}</div></div>
                            <div className="stat-item"><span>Location</span><div>{healthData.location || 'Not set'}</div></div>
                            <div className="stat-item full-width"><span>Conditions</span><div>{healthData.existing_conditions?.map(cond => cond.name).join(', ') || 'None'}</div></div>
                            <div className="stat-item"><span>BMI</span><div>{healthData.bmi || 'Not set'}</div></div>
                            <div className="stat-item"><span>BP</span><div>{healthData.bloodPressure || 'Not set'}</div></div>
                            <div className="stat-item"><span>Blood Sugar</span><div>{healthData.bloodSugar || 'Not set'}</div></div>
                        </div>
                    ) : (
                        <p>No health data. <Link to="/health-profile-form">Complete your profile</Link></p>
                    )}
                </div>
                {/* AI Nudge Card */}
                <div className="dashboard-card ai-card">
                    <div className="dashboard-card-header">
                        <div className="dashboard-card-icon ai-icon-bg"><FaRobot size={28} /></div>
                        <h2>AI Nudge</h2>
                    </div>
                    {latestAiRecommendation ? (
                        <>
                            <div className="ai-nudge-text">{latestAiRecommendation.suggested_goals || 'No recent nudges.'}</div>
                            <div className="ai-risk">Risk: {latestAiRecommendation.predicted_risk || 'N/A'}</div>
                        </>
                    ) : (
                        <p>No AI nudges yet.</p>
                    )}
                </div>
                {/* Appointments Card */}
                <div className="dashboard-card appointments-card">
                    <div className="dashboard-card-header">
                        <div className="dashboard-card-icon appointments-icon-bg"><FaCalendarAlt size={28} /></div>
                        <h2>Appointments</h2>
                    </div>
                    <div className="appointments-list">
                        <p>No upcoming appointments.</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;