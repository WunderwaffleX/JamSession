const Room = require('../models/Room');

exports.createRoom = async (req, res) => {
    const { name, rolesAvailable, videoConferenceUrl } = req.body;
    const userId = req.user.id;

    try {
        const room = new Room({
            name,
            creator: userId,
            rolesAvailable,
            videoConferenceUrl
        });
        await room.save();
        res.status(201).json(room);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getRooms = async (req, res) => {
    try {
        const rooms = await Room.find().populate('creator').populate('participants');
        res.status(200).json(rooms);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.joinRoom = async (req, res) => {
    const { roomId } = req.params;
    const userId = req.user.id;

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
