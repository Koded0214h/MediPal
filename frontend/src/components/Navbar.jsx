import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = ({ isAuthenticated }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo-title">
        <Link to="/" className="navbar-logo-link" onClick={() => setMenuOpen(false)}>
          <img src="/img/Medipal.jpg" alt="MediPal Logo" className="navbar-logo-img" />
          <span className="navbar-title">MediPal</span>
        </Link>
      </div>

      <button
        className="navbar-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggle-icon">&#9776;</span>
      </button>

      <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        <ul>
          <li>
            <NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink>
          </li>

          {isAuthenticated && (
            <>
              <li>
                <NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
              </li>
              <li>
                <NavLink to="/health-profile-form" onClick={() => setMenuOpen(false)}>Health Profile</NavLink>
              </li>
              <li>
                <NavLink to="/wallet" onClick={() => setMenuOpen(false)}>Wallet</NavLink>
              </li>
              <li>
                <NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink>
              </li>
            </>
          )}

          {isAuthenticated ? (
            <li>
              <button className="navbar-logout" onClick={handleLogout}>
                Logout
              </button>
            </li>
          ) : (
            <li>
              <NavLink to="/login" onClick={() => setMenuOpen(false)}>Login</NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
