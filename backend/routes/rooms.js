/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Room management
 */

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Get all available rooms
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: A list of rooms
 */

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Create a new room
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - name
 *               - description
 *     responses:
 *       201:
 *         description: Room created successfully
 */

const express = require('express');
const { createRoom, getRooms, joinRoom } = require('../controllers/roomController');
const authMiddleware = require('../middleware/authMiddleware'); // Мидлвар для проверки токена
const router = express.Router();

router.post('/create', authMiddleware, createRoom);
router.get('/', getRooms);
router.post('/:roomId/join', authMiddleware, joinRoom);

module.exports = router;
