import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';
import LoginForm from '../components/LoginForm';
import '../styles/login.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('/login/', {
                email: formData.email,
                password: formData.password,
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="login-page-layout">
            <div className="login-form-section">
                <LoginForm
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    error={error}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                />
            </div>
            <div className="login-image-section">
                <img src="/img/Medical prescription-bro.png" alt="Medical Illustration" />
                <div className="image-text-content">
                    <h2>Welcome Back to MediPal!</h2>
                    <p>Log in to continue your health journey.</p>
                </div>
            </div>
        </div>
    );
};

export default Login; 