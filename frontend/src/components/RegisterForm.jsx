import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaGlobe, FaPhone, FaLock } from 'react-icons/fa';

const RegisterForm = ({ formData, handleChange, handleCountryChange, handleSubmit, error, countries }) => {
    return (
        <>
            {error && <div className="register-error">{error}</div>}
            <form onSubmit={handleSubmit} className="register-form">
                <div className="form-group">
                    <label htmlFor="fullName"><FaUser style={{marginRight: '0.5rem'}} />Full Name</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email"><FaEnvelope style={{marginRight: '0.5rem'}} />Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="country"><FaGlobe style={{marginRight: '0.5rem'}} />Country</label>
                    <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleCountryChange}
                        required
                    >
                        {countries.map((c) => (
                            <option key={c.name} value={c.name}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group phone-group">
                    <label htmlFor="phoneNumber"><FaPhone style={{marginRight: '0.5rem'}} />Phone Number</label>
                    <div className="phone-input-group">
                        <span className="country-code">{formData.countryCode}</span>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="password"><FaLock style={{marginRight: '0.5rem'}} />Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword"><FaLock style={{marginRight: '0.5rem'}} />Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="register-btn">Register</button>
            </form>
            <p className="register-footer-link">
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </>
    );
};

export default RegisterForm; 