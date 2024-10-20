const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Настройки окружения
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Подключение маршрутов
const userRoutes = require('./routes/users');
const roomRoutes = require('./routes/rooms');

app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);

// Подключение к базе данных MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB Connected');
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
}).catch((err) => console.error(err));
