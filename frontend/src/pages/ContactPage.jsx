import React, { useState } from 'react';
import api from '../utils/axios';
import '../styles/ContactPage.css';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [status, setStatus] = useState(''); // 'success', 'error', ''

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('');
        try {
            const response = await api.post('/contact/', formData);
            if (response.status === 200) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' }); // Clear form
            } else {
                setStatus('error');
            }
        } catch (err) {
            setStatus('error');
            console.error("Contact form submission error:", err.response?.data || err.message);
        }
    };

    return (
        <div className="contact-page-container">
            <div className="contact-content-wrapper">
                <h2>Contact Us</h2>
                <p>We'd love to hear from you! Please fill out the form below or reach out directly.</p>

                {status === 'success' && <div className="success-message">Your message has been sent successfully!</div>}
                {status === 'error' && <div className="error-message">Failed to send message. Please try again later.</div>}

                <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-group">
                        <label htmlFor="name">Your Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Your Email</label>
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
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            rows="6"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="submit-button">Send Message</button>
                </form>
            </div>
        </div>
    );
};

export default ContactPage; 