import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import HealthProfileForm from '../components/HealthProfileForm'; // Import the new form component
import '../styles/HealthProfilePage.css';

const HealthProfilePage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        age: '',
        gender: '',
        location: '',
        existing_conditions: '', // This will be a comma-separated string for now
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch existing profile data if available
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/health-profile/');
                if (response.data) {
                    setFormData({
                        age: response.data.age || '',
                        gender: response.data.gender || '',
                        location: response.data.location || '',
                        // Convert array of condition objects to comma-separated string for input
                        existing_conditions: response.data.existing_conditions ? response.data.existing_conditions.map(cond => cond.name).join(', ') : '',
                    });
                }
            } catch (err) {
                console.error("Failed to fetch health profile", err);
                // Do not set an error message that blocks the form if it's just not found
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            // Split conditions string into an array of names
            const conditionsArray = formData.existing_conditions
                .split(',')
                .map(cond => cond.trim())
                .filter(cond => cond !== '');

            const payload = {
                age: parseInt(formData.age, 10),
                gender: formData.gender,
                location: formData.location,
                existing_conditions_names: conditionsArray, // Send as a list of names
            };

            const response = await api.post('/health-profile/', payload);

            if (response.status === 200) { // Assuming 200 OK for update/create
                setSuccessMessage('Health profile saved successfully!');
                navigate('/dashboard'); // Redirect to dashboard after saving
            } else {
                setError(response.data.message || 'Failed to save health profile.');
            }
        } catch (err) {
            console.error("Error saving health profile:", err.response?.data || err.message);
            setError(err.response?.data?.message || 'Failed to save health profile. Please try again.');
        }
    };

    return (
        <div className="health-profile-page">
            <HealthProfileForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                error={error}
                successMessage={successMessage}
            />
        </div>
    );
};

export default HealthProfilePage; 