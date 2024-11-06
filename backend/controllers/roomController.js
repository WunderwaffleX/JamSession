const Room = require('../models/Room');
const User = require('../models/User');
const zlib = require('zlib');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const mongoose = require('mongoose');

 const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmFwcGVhci5pbiIsImF1ZCI6Imh0dHBzOi8vYXBpLmFwcGVhci5pbi92MSIsImV4cCI6OTAwNzE5OTI1NDc0MDk5MSwiaWF0IjoxNzMwODA0MDMzLCJvcmdhbml6YXRpb25JZCI6Mjg1MDkwLCJqdGkiOiIyNjIxY2IyOC04ZjBjLTQxYWUtOGM5My04NGE4YmRiMGU4ZGUifQ.YmyfGxM1Zf-TZTRARXlgsALs0YturrFy7lrCigsCVJI";
 const data = {
     endDate: "2099-02-18T14:23:00.000Z",
     fields: ["hostRoomUrl"],
   };
const oneDayInMs = 24 * 60 * 60 * 1000;

exports.createRoom = async (req, res) => {
    const { name, rolesAvailable } = req.body;
    const userId = req.user.id;
    const endDate = new Date(Date.now() + oneDayInMs);

    try {
        // Запрос к API Whereby для создания ссылки на видеоконференцию
        const wherebyResponse = await fetch('https://api.whereby.dev/v1/meetings', {
            method: "POST",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "endDate": endDate.toISOString(),
            "roomNamePrefix": `${name}`,
            fields: ["hostRoomUrl"],
          }),
        });

        // console.log('Whereby Response:', wherebyResponse);

        const wherebyData = await wherebyResponse.json();
        
        if (!wherebyResponse.ok) {
            return res.status(500).json({ message: 'Failed to create Whereby room', error: wherebyData });
        }

        const room = new Room({
            name,
            creator: userId,
            rolesAvailable,
            videoConferenceUrl: wherebyData.roomUrl, // Сохраняем URL комнаты
        });
        
        await room.save();
        res.status(201).json(room);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};

exports.getRooms = async (req, res) => {
    try {
        const response = await fetch('https://api.whereby.dev/v1/meetings', {
            method: 'GET',
            headers: {
                // Include your authorization header here if needed
                'Authorization': `Bearer ${API_KEY}`,
                'Accept-Encoding': 'gzip'
            },
        });
        // console.log('Whereby Response:', response);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const wherebyData = await response.json();
        // console.log("Whereby API response:", wherebyData);

        const roomsFromAPI = wherebyData.results || [];

        const dbRooms = await Room.find();
        const filteredRooms = roomsFromAPI
        .map(room => {
            const dbRoom = dbRooms.find(dbRoom => dbRoom.videoConferenceUrl === room.roomUrl);
            
            // Если комната существует в базе данных, добавляем rolesAvailable
            if (dbRoom) {
                return {
                    ...room,
                    rolesAvailable: dbRoom.rolesAvailable
                };
            }
            else{

            }
            return null; // Убираем комнаты, которых нет в базе данных
        })
        .filter(room => room !== null);

        res.status(200).json(filteredRooms);
        // console.log("filtered Rooms:", filteredRooms);

        const roomsToDelete = roomsFromAPI.filter(room => 
            !dbRooms.some(dbRoom => dbRoom.videoConferenceUrl === room.roomUrl)
        );

        for (const room of roomsToDelete) {
            await fetch(`https://api.whereby.dev/v1/meetings/${room.meetingId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`
                },
            });
            console.log(`Deleted room: ${room.meetingId}`);
        }

        res.status(200).json(filteredRooms);
    } catch (error) {
        // console.error('Error fetching rooms:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: error.message });
        }
    }
};



exports.joinRoom = async (req, res) => {
    const { roomId } = req.params;
    const userId = req.user.id;
    console.log("roomId", roomId);
    console.log("userId", userId);
    try {
        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ message: 'Room not found' });

        if (room.participants.includes(userId)) {
            return res.status(400).json({ message: 'User already in the room' });
        }

        room.participants.push(userId);
        await room.save();
        res.status(200).json(room);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.addUserRole = async (req, res) => {
    console.log('adduserrole');
    try {
        const { roomName } = req.body; // Получаем имя комнаты из запроса
        const room = await Room.findOne({ name: roomName });
        const userId = req.user.id; // Получаем ID пользователя из авторизации
    
        if (!room) return res.status(404).json({ message: 'Комната не найдена' });
    
        // Ищем пользователя в базе данных по userId
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
    
        const role = user.role; // Получаем роль пользователя из записи в базе данных
    
        // Проверяем, есть ли роль в комнате, и добавляем, если её там нет
        if (!room.rolesAvailable.includes(role)) {
            room.rolesAvailable.push(role);
            await room.save();
            res.status(200).json({ message: 'Роль успешно добавлена' });
        } else {
            res.status(200).json({ message: 'Роль уже существует' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при добавлении роли' });
    }
};

exports.removeUserRole = async (req, res) => {
    console.log('removeuserrole:', req.body);
    try {
        const roomName = req.body.roomName; // Получаем имя комнаты из запроса
        const room = await Room.findOne({ name:roomName });
        const userId = req.user.id; // Получаем ID пользователя из авторизации
        // console.log("userID:", userId);
        if (!room) return res.status(404).json({ message: 'Комната не найдена' });
    
        // Ищем пользователя в базе данных по userId
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
    
        const role = user.role.charAt(0).toUpperCase() + user.role.slice(1); // Получаем роль пользователя из записи в базе данных
        console.log('role', role);   
        // Удаляем роль из списка ролей
        room.rolesAvailable = room.rolesAvailable.filter(r => r !== role);
        console.log('room', room);   
        await room.save();
        res.status(200).json({ message: 'Роль успешно удалена' });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: 'Ошибка при удалении роли' });
    }
};