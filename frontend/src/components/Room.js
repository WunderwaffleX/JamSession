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
        await axios.post(
          'http://localhost:5000/api/rooms/addUserRole',
          { roomName },
          {
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
              },
          }
        );
      } catch (error) {
        console.error('Ошибка при добавлении роли:', error);
    }
    navigate('/rooms'); // Переход на страницу списка комнат
    };
    
    useEffect(() => {
      const addRoleOnUnload = async () => {
          try {
              await axios.post(
                  'http://localhost:5000/api/rooms/addUserRole',
                  { roomName },
                  {
                      headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${token}`,
                      },
                  }
              );
              console.log("Role added successfully on unload");
          } catch (error) {
              console.error("Error adding role on unload:", error);
          }
      };
  
      const handleBeforeUnload = (event) => {
          event.preventDefault();
          addRoleOnUnload();
      };
  
      // Устанавливаем обработчик события для закрытия вкладки
      window.addEventListener('beforeunload', handleBeforeUnload);
  
      return () => {
          // Удаляем обработчик события при размонтировании компонента
          window.removeEventListener('beforeunload', handleBeforeUnload);
      };
  }, [token, roomName]);
    
    
    const [username, setUsername] = useState('');
    const [Url, setUrl] = useState('');


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
            const responseurl =  await axios.post('http://localhost:5000/api/rooms/removeUserRole',
              { roomName: roomName}, // Передаем нужные данные
              {
                method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`, // Добавьте токен в заголовок
              },
            });
            console.log("response:", responseurl);
            setUrl(responseurl.data.roomUrl);
          } catch (error) {
            console.error('Error fetching user data:', error);
            // handleLeaveRoom();
          }
        };
    
        fetchUserData();
      }, [token, roomName]);
    // Формируем URL для Whereby комнаты
    const roomUrl = `${Url}?displayName=${username}`;
    // console.log("url", Url);
    // console.log("roomurl", roomUrl);
    // console.log(roomUrl)
    return (
        <div className="room-container">
            <h2>Welcome to the room "{roomName}", {username}!</h2>
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
