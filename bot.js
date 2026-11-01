
require('dotenv').config();

const express = require('express');
const multer = require('multer');
const { Telegraf } = require('telegraf');

const app = express();

const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_ID = process.env.ADMIN_ID;

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }
});

app.use(express.static(__dirname));

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
            { caption: req.body.caption || 'Фото 📸' }
        );

        res.json({ success: true });

    } catch (error) {
        console.error('Telegram error:', error.message);

        res.status(500).json({
            error: 'Не удалось отправить фото в Telegram'
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Сайт работает: http://localhost:${PORT}`);
});

bot.launch();

console.log('Telegram-бот запущен!');
