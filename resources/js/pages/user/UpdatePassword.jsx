import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import axios from 'axios';

const UpdatePassword = () => {
    const [formData, setFormData] = useState({
        current_password: '',
        password: '',
        password_confirmation: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('/password/update', formData);
            setSuccess(response.data.message);
            setFormData({ current_password: '', password: '', password_confirmation: '' });
        } catch (err) {
            setError(err.response.data.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container py-4">
                <h1>Update Password</h1>
                {success && <div className="alert alert-success">{success}</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="current_password">Current Password</label>
                        <input type="password" id="current_password" name="current_password" className="form-control" value={formData.current_password} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password">New Password</label>
                        <input type="password" id="password" name="password" className="form-control" value={formData.password} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password_confirmation">Confirm New Password</label>
                        <input type="password" id="password_confirmation" name="password_confirmation" className="form-control" value={formData.password_confirmation} onChange={handleChange} />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default UpdatePassword;
