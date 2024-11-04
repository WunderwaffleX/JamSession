import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Rooms.css';

const Rooms = () => {
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    navigate('/create-room');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="rooms-container">
      <h2>Available Rooms</h2>
      {/* Список комнат можно динамически загружать из бекенда */}
      <ul>
        <li>Room 1</li>
        <li>Room 2</li>
        <li>Room 3</li>
      </ul>
      <button onClick={handleCreateRoom} className="create-room-button">
        Create Room
      </button>
      <button onClick={handleProfile} className="profile-button">
        Profile
      </button>
    </div>
  );
};

export default Rooms;
