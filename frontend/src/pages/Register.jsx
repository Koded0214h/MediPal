import React, { useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import '../styles/Register.css';
import RegisterForm from '../components/RegisterForm';

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
        // Simulate registration logic
        setTimeout(() => {
            setError('');
            // Redirect or update auth state here
        }, 1200);
    };

    return (
        <div className="register-main-bg">
            <div className="register-flex-wrapper">
                <div className="register-card">
                    <div className="register-card-header">
                        <div className="register-card-icon">
                            <FaUserPlus />
                        </div>
                        <h2>Create Your MediPal Account</h2>
                    </div>
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
        </div>
    );
};

export default Register;
