import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaLock, FaSignInAlt } from 'react-icons/fa';
import api from '../utils/axios';
import '../styles/login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            console.log('Attempting login with:', { email, password });
            const response = await api.post('/login/', {
                email: email,
                password: password,
            });
            
            console.log('Login response:', response.data);
            
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                console.log('Token stored, redirecting to dashboard');
                navigate('/dashboard');
            } else {
                setError('Login failed. No token received.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-main-bg">
            <div className="login-flex-wrapper">
                <div className="login-card">
                    <div className="login-card-header">
                        <div className="login-card-icon">
                            <FaSignInAlt />
                        </div>
                        <h2>Sign In to MediPal</h2>
                    </div>
                    {error && <div className="login-error">{error}</div>}
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email"><FaUserCircle style={{marginRight: '0.5rem'}} />Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                autoComplete="username"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password"><FaLock style={{marginRight: '0.5rem'}} />Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                            />
                        </div>
                        <button className="login-btn" type="submit" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                    <div className="login-footer-links">
                        <a href="/register">Don&apos;t have an account? Register</a>
                        <a href="/forgot-password">Forgot password?</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login; 