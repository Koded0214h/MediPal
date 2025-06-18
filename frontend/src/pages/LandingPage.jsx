import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-container">
            <nav className="landing-nav">
                <div className="logo">MediPal</div>
                <div className="nav-links">
                    <Link to="/login" className="login-btn">Login</Link>
                    <Link to="/register" className="register-btn">Get Started</Link>
                </div>
            </nav>

            <main className="hero-section">
                <div className="hero-content">
                    <h1>Your Health, Your Wealth</h1>
                    <p className="hero-subtitle">
                        Save for healthcare, get AI-powered health insights, and join a community
                        that supports your wellness journey.
                    </p>
                    <div className="cta-buttons">
                        <Link to="/register" className="primary-btn">Start Saving Now</Link>
                        <Link to="/about">Learn More</Link>
                    </div>
                </div>
                <div className="hero-image">
                    <img src="/img/Medical prescription-bro.png" alt="Health Illustration" />
                </div>
            </main>

            <section className="features-section">
                <h2>Why Choose MediPal?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">💰</div>
                        <h3>Smart Savings</h3>
                        <p>Set health goals and save automatically with our smart wallet system.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🤖</div>
                        <h3>AI Health Insights</h3>
                        <p>Get personalized health recommendations powered by advanced AI.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">👥</div>
                        <h3>Community Support</h3>
                        <p>Join health circles and support groups to stay motivated.</p>
                    </div>
                </div>
            </section>

            <section className="testimonials-section">
                <h2>What Our Users Say</h2>
                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <p>"MediPal helped me save for my surgery. The community support was amazing!"</p>
                        <div className="testimonial-author">- Sarah M.</div>
                    </div>
                    <div className="testimonial-card">
                        <p>"The AI health insights are spot on. It's like having a personal health advisor."</p>
                        <div className="testimonial-author">- John D.</div>
                    </div>
                </div>
            </section>

            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h4>MediPal</h4>
                        <p>Making healthcare accessible and affordable for everyone.</p>
                    </div>
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <Link to="/about">About Us</Link>
                        <Link to="/contact">Contact</Link>
                        <Link to="/privacy">Privacy Policy</Link>
                    </div>
                    <div className="footer-section">
                        <h4>Connect With Us</h4>
                        <div className="social-links">
                            <a href="#" target="_blank" rel="noopener noreferrer">Twitter</a>
                            <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                            <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 MediPal. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage; 