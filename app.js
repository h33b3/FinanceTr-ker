const express = require('express');
const cors = require('cors');
const authController = require('./server/authController');
const { db } = require('./server/database');
const authMiddleware = require('./server/middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Регистрация
app.post('/api/register', async (req, res) => {
    try {
        const { email, login, password } = req.body;
        const userId = await authController.register(email, login, password);
        res.json({ success: true, userId });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Авторизация
app.post('/api/login', async (req, res) => {
    try {
        const { login, password } = req.body;
        const user = await authController.login(login, password);
        
        const token = jwt.sign(
            { userId: user.id, login: user.login },
            'your-secret-key',
            { expiresIn: '1h' }
        );
        
        res.json({ success: true, token });
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
});

// Защищенные роуты
app.use('/api/accounts', authMiddleware, require('./routes/accounts'));
app.use('/api/transactions', authMiddleware, require('./routes/transactions'));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));