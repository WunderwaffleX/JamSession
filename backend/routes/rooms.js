const express = require('express');
const { createRoom, getRooms, joinRoom } = require('../controllers/roomController');
const authMiddleware = require('../middleware/authMiddleware'); // Мидлвар для проверки токена
const router = express.Router();

router.post('/create', authMiddleware, createRoom);
router.get('/', getRooms);
router.post('/:roomId/join', authMiddleware, joinRoom);

module.exports = router;
