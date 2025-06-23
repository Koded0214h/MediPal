import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/login/', {
        email,
        password,
      });

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        // Redirect user to dashboard or homepage
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError('Invalid login credentials');
    }
  };

  return (
    <form onSubmit={handleLogin} className="login-form">
      <h2>Welcome Back</h2>
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          className="value"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          className="value"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <span
          className="fas"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      <button type="submit" className="login-button">
        Log In
      </button>
      
      <p className="register-link">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
      
      <div className="terms">
        <p>Forgot Password?</p>
      </div>
    </form>
  );
};

export default LoginForm;
