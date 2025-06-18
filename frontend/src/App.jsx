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
import RegisterPage from './pages/Register';
import LoginPage from './pages/Login';
import ContactPage from './pages/ContactPage';

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
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/circle" element={<CirclePage />} />
                <Route path="/health-profile-form" element={<HealthProfilePage />} />
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
