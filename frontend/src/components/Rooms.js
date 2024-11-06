import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Rooms.css';

const Rooms = () => {
  const [rooms, setRooms] = useState([]); // State to hold room data
  const navigate = useNavigate();

  useEffect(() => {
    // Function to fetch rooms from the backend
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/rooms'); // Adjust the URL to your backend
        if (!response.ok) {
          throw new Error('Failed to fetch rooms');
        }
        console.log('rooms:', rooms);
        const data = await response.json();
        setRooms(data); // Access results array in the API response
      } catch (error) {
        console.error('Error fetching rooms:', error);
        alert('Could not load rooms. Please try again later.');
      }
    };

    fetchRooms(); // Call the fetch function when the component mounts
  }, []); // Empty dependency array means this effect runs once on mount

  const handleCreateRoom = () => {
    navigate('/create-room');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleRoomClick = (roomName) => {

    navigate(`/room${roomName}`); // Переход на страницу комнаты
  };

  return (
    <div className="rooms-container">
      <h2>Available Rooms</h2>
      {/* Dynamically render the list of rooms */}
      <ul>
      {rooms.length > 0 ? (
          rooms.map((room) => (
            <li key={room.meetingId} onClick={() => handleRoomClick(room.roomName)}>
              {/* <a href={room.roomUrl} target="_blank" rel="noopener noreferrer"> */}
              <a target="_blank" rel="noopener noreferrer">
                {room.roomName.substring(1, room.roomName.length - 36)}
              </a>
              <p>Roles: {room.rolesAvailable ? room.rolesAvailable.join(', ') : 'No roles available'}</p>
              <p>End Date: {new Date(room.endDate).toLocaleString()}</p>
            </li>
          ))
        ) : (
          <li>No rooms available</li>
        )}
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
