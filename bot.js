
require('dotenv').config();

const express = require('express');
const multer = require('multer');
const { Telegraf } = require('telegraf');
const cors = require('cors');

const app = express();

const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_ID = process.env.ADMIN_ID;

app.use(cors({
    origin: 'npm install cors'
}));

app.use(express.json());

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

// Проверка сервера
app.get('/', (req, res) => {
    res.send('Photobooth Telegram Server is running!');
});

// Получение и отправка фотографий
app.post('/send-photos', upload.single('photo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: 'Фотография не найдена'
            });
        }

        await bot.telegram.sendPhoto(
            ADMIN_ID,
            { source: req.file.buffer },
            {
                caption: req.body.caption || 'Фото 📸'
            }
        );

        res.json({
            success: true,
            message: 'Фото отправлено!'
        });

    } catch (error) {
        console.error('Telegram error:', error.message);

        res.status(500).json({
            error: 'Ошибка отправки фотографии'
        });
    }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

// Запуск Telegram-бота
bot.launch()
    .then(() => console.log('Telegram-бот запущен!'))
    .catch(error => console.error('Ошибка запуска бота:', error));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
