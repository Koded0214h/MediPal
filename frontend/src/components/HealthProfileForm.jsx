import React from 'react';

const HealthProfileForm = ({ formData, handleChange, handleSubmit, error, successMessage }) => {
    return (
        <div className="health-profile-wrapper">
            <h2>Complete Your Health Profile</h2>
            <p>Tell us more about your health to get personalized recommendations.</p>
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            <form onSubmit={handleSubmit} className="health-profile-form">
                <div className="form-group">
                    <label htmlFor="age">Age</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="existing_conditions">Existing Conditions (comma-separated)</label>
                    <textarea
                        id="existing_conditions"
                        name="existing_conditions"
                        value={formData.existing_conditions}
                        onChange={handleChange}
                        placeholder="e.g., Asthma, Diabetes, Hypertension"
                    ></textarea>
                </div>
                <button type="submit" className="save-profile-button">Save Profile</button>
            </form>
        </div>
    );
};

export default HealthProfileForm; 