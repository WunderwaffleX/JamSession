const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rolesAvailable: { type: [String], enum: ['bass', 'vocal', 'drums', 'guitar', 'keyboard'], required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    videoConferenceUrl: { type: String }
});

module.exports = mongoose.model('Room', RoomSchema);