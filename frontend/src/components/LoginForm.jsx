import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginForm = ({ formData, handleChange, handleSubmit, error, showPassword, setShowPassword }) => {
    return (
        <form onSubmit={handleSubmit} className="login-form">
            <h2>Welcome Back</h2>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
                <label htmlFor="email">Email</label>
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
                <label htmlFor="password">Password</label>
                <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <span
                    className="fas"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
            </div>
            <button type="submit" className="login-button">Login</button>
            <p className="register-link">
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </form>
    );
};

export default LoginForm;