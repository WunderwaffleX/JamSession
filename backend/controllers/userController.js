const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        const user = new User({ username, email, password, role });
        await user.save();
        res.status(201).json({ message: 'User registered' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        // Получаем ID пользователя из middleware
        const userId = req.user.id;

        // Ищем пользователя в базе данных
        const user = await User.findById(userId).select('-password'); // Исключаем пароль из ответа

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Возвращаем данные пользователя
        res.json({
            username: user.username,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        // Получаем ID пользователя из middleware
        const userId = req.user.id;

        // Обновляем данные пользователя в базе данных
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: req.body }, // Обновляем только поля, которые переданы в запросе
            { new: true, runValidators: true } // Возвращаем обновленный объект и проверяем данные
        ).select('-password'); // Исключаем пароль из ответа

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Возвращаем обновленные данные пользователя
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: 'Error updating profile' });
    }
};
