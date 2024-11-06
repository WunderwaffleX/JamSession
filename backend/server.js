const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Загрузка переменных окружения
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Подключение маршрутов
const userRoutes = require('./routes/users');
const roomRoutes = require('./routes/rooms');

app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);

JWT_SECRET='bipbip'

// Подключение к базе данных MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Подключено к базе данных MongoDB');
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Сервер запущен на порту ${process.env.PORT || 5000}`);
    });
}).catch((err) => console.error('Ошибка подключения к базе данных:', err));
