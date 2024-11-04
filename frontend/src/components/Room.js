import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Room.css'; // Создайте стили для страницы комнаты

const Room = () => {
    const { roomName } = useParams();
    const navigate = useNavigate();

    const handleLeaveRoom = () => {
        navigate('/rooms'); // Переход на страницу списка комнат
    };

    return (
        <div className="room-container">
            <h2>Room: {roomName}</h2>
            <div className="participants-section">Connected Users: [Add logic]</div>
            <div className="video-section">Video Conference Window</div>
            <button onClick={handleLeaveRoom} className="leave-room-button">Leave Room</button>
        </div>
    );
};

export default Room;
