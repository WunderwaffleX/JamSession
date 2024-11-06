const express = require('express');
// const { createRoom, getRooms, joinRoom } = require('../controllers/roomController');
const { createRoom, getRooms, joinRoom, addUserRole, removeUserRole } = require('../controllers/roomController');
const authMiddleware = require('../middleware/authMiddleware'); // Мидлвар для проверки токена
const router = express.Router();

router.post('/create', authMiddleware, createRoom);
router.post('/addUserRole', authMiddleware, addUserRole);
router.post('/removeUserRole', authMiddleware, removeUserRole);
router.get('/', getRooms);
router.post('/:room/join', authMiddleware, joinRoom);

module.exports = router;
