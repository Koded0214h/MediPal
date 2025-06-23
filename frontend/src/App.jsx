import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './index.css'
import './styles/login.css'
import Navbar from './components/Navbar';
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard';
import CirclePage from './pages/CirclePage';
import LandingPage from './pages/LandingPage';
import HealthProfilePage from './pages/HealthProfilePage';
import Register from './pages/Register';
import Login from './pages/Login';
import ContactPage from './pages/ContactPage';
import Wallet from './pages/Wallet';
import HealthQuiz from './pages/HealthQuiz'
import ProfilePage from './pages/ProfilePage'
import CircleDetails from './pages/CircleDetails'
import ProvidersPage from './pages/ProvidersPage'
import SettingsPage from './pages/SettingsPage'

// Create a new component that uses useLocation
function AppContent() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const location = useLocation(); // Now useLocation is inside Router context

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);

        const handleStorageChange = () => {
            setIsAuthenticated(!!localStorage.getItem('token'));
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Define paths where Navbar should NOT be displayed
    const noNavbarPaths = ['/', '/register', '/login'];
    const shouldShowNavbar = !noNavbarPaths.includes(location.pathname);

    return (
        <>
            {shouldShowNavbar && <Navbar isAuthenticated={isAuthenticated} />}
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/circle" element={<CirclePage />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/quiz" element={<HealthQuiz />} />
                <Route path="/health-profile-form" element={<HealthProfilePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/circledet" element={<CircleDetails />} />
                <Route path="/provider" element={<ProvidersPage />} />
                <Route path="/settings" element={<SettingsPage />} />
            </Routes>
        </>
    );
}

// Main App component that provides the Router context
function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App; 
