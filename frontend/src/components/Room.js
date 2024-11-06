import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './Room.css'; // Убедитесь, что стили определены

const Room = () => {
    const { roomName } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLeaveRoom = async() => {
      try {
        await axios.post('http://localhost:5000/api/rooms/addUserRole', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Добавьте токен в заголовок
            },
            body: JSON.stringify({ name: roomName}), // Передаем нужные данные
        });
      } catch (error) {
        console.error('Ошибка при добавлении роли:', error);
    }
    navigate('/rooms'); // Переход на страницу списка комнат
    };
    const [username, setUsername] = useState('');
    useEffect(() => {
        const fetchUserData = async () => {
          try {
            // const token = localStorage.getItem('token');
            const response = await axios.get('/api/users/profile', {
              headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response);
            setUsername(response.data.username); // Сохраняем имя пользователя
            console.log(roomName);
            await axios.post('http://localhost:5000/api/rooms/removeUserRole',
              { roomName: roomName.substring(0, roomName.length - 36)}, // Передаем нужные данные
              {
                method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`, // Добавьте токен в заголовок
              },
          });
          } catch (error) {
            console.error('Error fetching user data:', error);
            navigate('/rooms');
          }
        };
    
        fetchUserData();
      }, []);
    // Формируем URL для Whereby комнаты
    const roomUrl = `https://jam-session.whereby.com/${roomName}?displayName=${username}`;
    // console.log(roomUrl)
    return (
        <div className="room-container">
            <h2>Welcome to the room "{roomName.substring(0, roomName.length - 36)}", {username}!</h2>
            <div className="participants-section">Connected Users: [Add logic]</div>
            <div className="video-section">
                <iframe
                    src={roomUrl}
                    title="Video Conference"
                    style={{ width: '1600px', height: '800px', border: 'none' }}
                    allow="camera; microphone; fullscreen; speaker"
                />
            </div>
            <button onClick={handleLeaveRoom} className="leave-room-button">Leave Room</button>
        </div>
    );
};

export default Room;
