import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState({ username: '', email: '', role: '' });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', role: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/users/profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(formData);
      setEditMode(false);
      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile. Please try again.');
    }
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      {message && <p className="profile-message">{message}</p>}
      {!editMode ? (
        <div className="profile-details">
          <p><strong>Username:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Role:</strong> {userData.role}</p>
          <button onClick={() => setEditMode(true)} className="edit-button">Edit Profile</button>
        </div>
      ) : (
        <div className="profile-edit-form">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Username"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
          />
          <select name="role" value={formData.role} onChange={handleInputChange}>
            <option value="bass">Bass</option>
            <option value="vocal">Vocal</option>
            <option value="drums">Drums</option>
            <option value="guitar">Guitar</option>
            <option value="keyboard">Keyboard</option>
          </select>
          <button onClick={handleSave} className="save-button">Save</button>
          <button onClick={() => setEditMode(false)} className="cancel-button">Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Profile;
