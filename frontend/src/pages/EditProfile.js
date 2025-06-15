import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const EditProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    goalWeight: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setError('❌ You are not logged in.');
        navigate('/login');
        return;
      }

      try {
        const { data } = await API.get('/profile');
        setFormData({
          name: data.name || '',
          age: data.age?.toString() || '',
          height: data.height?.toString() || '',
          weight: data.weight?.toString() || '',
          goalWeight: data.goalWeight?.toString() || '',
        });
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.msg || err.message || '❌ Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent invalid input for number fields
    if (['age', 'height', 'weight', 'goalWeight'].includes(name) && value !== '') {
      if (!/^\d+$/.test(value)) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    const token = localStorage.getItem('token');

    if (!token) {
      setError('❌ You are not logged in.');
      navigate('/login');
      return;
    }

    try {
      const payload = {
        ...formData,
        age: Number(formData.age),
        height: Number(formData.height),
        weight: Number(formData.weight),
        goalWeight: Number(formData.goalWeight),
      };

      const { data } = await API.put('/profile', payload);
      setMessage(data.msg || '✅ Profile updated!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.msg || err.message || '❌ Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center text-primary mb-4">✏️ Edit Profile</h2>

      {loading && <div className="alert alert-info">Loading...</div>}
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && (
        <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '500px' }}>
          {['name', 'age', 'height', 'weight', 'goalWeight'].map((field) => (
            <div className="mb-3" key={field}>
              <label className="form-label" htmlFor={field}>
                {field === 'goalWeight'
                  ? 'Goal Weight'
                  : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === 'name' ? 'text' : 'number'}
                className="form-control"
                name={field}
                id={field}
                placeholder={
                  field === 'height'
                    ? 'in cm'
                    : field === 'weight' || field === 'goalWeight'
                    ? 'in kg'
                    : ''
                }
                value={formData[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
          <button type="submit" className="btn btn-success w-100 rounded-pill">
            💾 Save Changes
          </button>
        </form>
      )}
    </div>
  );
};

export default EditProfile;
