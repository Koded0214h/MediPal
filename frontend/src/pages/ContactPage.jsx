import React, { useState } from 'react';
import { FaEnvelopeOpenText, FaUser, FaEnvelope, FaCommentDots } from 'react-icons/fa';
import api from '../utils/axios';
import '../styles/ContactPage.css';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [status, setStatus] = useState(''); // 'success', 'error', ''
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('');
        setLoading(true);
        
        try {
            console.log('Sending contact form:', formData);
            const response = await api.post('/contact/', formData);
            
            console.log('Contact form response:', response.data);
            
            if (response.status === 200) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch (err) {
            console.error('Contact form error:', err);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-main-bg">
            <div className="contact-flex-wrapper">
                <div className="contact-card">
                    <div className="contact-card-header">
                        <div className="contact-card-icon">
                            <FaEnvelopeOpenText />
                        </div>
                        <h2>Contact Us</h2>
                    </div>
                    <p className="contact-card-desc">We'd love to hear from you! Please fill out the form below or reach out directly.</p>
                    {status === 'success' && <div className="contact-success">Your message has been sent successfully!</div>}
                    {status === 'error' && <div className="contact-error">Failed to send message. Please try again later.</div>}
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-group">
                            <label htmlFor="name"><FaUser style={{marginRight: '0.5rem'}} />Your Name</label>
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
                            <label htmlFor="email"><FaEnvelope style={{marginRight: '0.5rem'}} />Your Email</label>
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
                            <label htmlFor="message"><FaCommentDots style={{marginRight: '0.5rem'}} />Message</label>
                            <textarea
                                id="message"
                                name="message"
                                rows="6"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="contact-btn" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage; 