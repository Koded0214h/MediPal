import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import '../styles/Register.css'; // CSS file
import RegisterForm from '../components/RegisterForm'; // Import the new form component

const countries = [
    { name: 'Nigeria', code: '+234' },
    { name: 'United States', code: '+1' },
    { name: 'United Kingdom', code: '+44' },
    { name: 'Canada', code: '+1' },
    { name: 'Australia', code: '+61' },
    { name: 'Germany', code: '+49' },
    { name: 'France', code: '+33' },
    { name: 'India', code: '+91' },
    { name: 'Brazil', code: '+55' },
    { name: 'South Africa', code: '+27' },
];

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        countryCode: countries[0].code,
        country: countries[0].name,
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCountryChange = (e) => {
        const selectedCountryName = e.target.value;
        const selectedCountry = countries.find(c => c.name === selectedCountryName);
        setFormData({
            ...formData,
            country: selectedCountryName,
            countryCode: selectedCountry ? selectedCountry.code : '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await api.post('/register/', {
                fullName: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                countryCode: formData.countryCode,
                country: formData.country,
                password: formData.password,
            });

            if (response.status === 201) {
                localStorage.setItem('token', response.data.token);
                console.log('Token stored:', response.data.token); // Debugging line
                navigate('/health-profile-form');
            } else {
                setError(response.data.message || 'Registration failed.');
            }
        } catch (err) {
            console.error('Registration error:', err.response?.data || err.message); // More detailed error
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="register-page-layout">
            <div className="register-image-section">
                <img src="/img/Medical prescription-bro.png" alt="Medical Illustration" />
                <div className="image-text-content">
                    <h2>Welcome to MediPal!</h2>
                    <p>Start your journey to better health management today.</p>
                </div>
            </div>
            <div className="register-form-section">
                <RegisterForm
                    formData={formData}
                    handleChange={handleChange}
                    handleCountryChange={handleCountryChange}
                    handleSubmit={handleSubmit}
                    error={error}
                    countries={countries}
                />
            </div>
        </div>
    );
};

export default Register;
