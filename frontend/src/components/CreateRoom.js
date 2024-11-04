import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateRoom.css'; // Подключаем стили

const CreateRoom = () => {
    const [roomName, setRoomName] = useState('');
    const [description, setDescription] = useState('');
    const [roles, setRoles] = useState([]);
    const [availableRoles] = useState(['Bass', 'Vocal', 'Drums', 'Guitar', 'Keyboard']);
    const navigate = useNavigate();

    const handleRoleChange = (e) => {
        const value = e.target.value;
        setRoles((prevRoles) =>
            prevRoles.includes(value) ? prevRoles.filter((role) => role !== value) : [...prevRoles, value]
        );
    };

    const handleCreateRoom = (e) => {
        e.preventDefault();
        if (roomName && description && roles.length > 0) {
            // Логика создания комнаты и перехода
            console.log('Room created:', { roomName, description, roles });
            navigate(`/room/${roomName}`); // Переход на страницу комнаты с уникальным URL
        } else {
            alert('Please fill out all fields and select at least one role.');
        }
    };

    return (
        <div className="create-room-container">
            <h2>Create a New Room</h2>
            <form className="create-room-form" onSubmit={handleCreateRoom}>
                <label htmlFor="roomName">Room Name</label>
                <input
                    type="text"
                    id="roomName"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Enter room name"
                    required
                />

                <label htmlFor="description">Description</label>
                <input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter room description"
                    required
                />

                <label>Available Roles</label>
                <div className="roles-container">
                    {availableRoles.map((role) => (
                        <div key={role}>
                            <input
                                type="checkbox"
                                value={role}
                                onChange={handleRoleChange}
                                id={`role-${role}`}
                            />
                            <label htmlFor={`role-${role}`}>{role}</label>
                        </div>
                    ))}
                </div>

                <button type="submit">Create Room</button>
            </form>
        </div>
    );
};

export default CreateRoom;
