const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') })
const cron = require('node-cron');
const TelegramBotApi = require('node-telegram-bot-api');
const pool = require('../db-connection')


// Инициализация бота
const bot = new TelegramBotApi(process.env.TELEGRAM_BOT_TOKEN, {
    polling: false 
});


// Функция для получения сообщений, ожидающих отправки
async function getPendingMessages() {
    try {
        const query = `
          SELECT tl_id, user_id, chat_id, payload_text, created_on_tz
          FROM telegram_log
          WHERE sent_on_tz IS NULL
          ORDER BY created_on_tz ASC
          LIMIT 50
        `;
        const { rows } = await pool.query(query);
        return rows;
    } catch (error) {
        console.error('TelegramWorker::Ошибка при получении сообщений:', error);
        return [];
    }
}


// Функция для отправки сообщения через Telegram
async function sendTelegramMessage(message) {
    try {
        await bot.sendMessage(
          message.chat_id,
          message.payload_text
        );

        // Помечаем сообщение как отправленное
        await pool.query('UPDATE telegram_log SET sent_on_tz = NOW() WHERE tl_id = $1', [message.tl_id]);

        return true;
    } catch (error) {
        console.error(`TelegramWorker::Ошибка при отправке сообщения ${message.tl_id}:`, error);       
        return false;
    }
}


// Основная функция воркера
async function processPendingMessages() {
    try {
        console.log('TelegramWorker::Проверка сообщений...', new Date().toISOString());
        const messages = await getPendingMessages();
        
        if (messages.length > 0) {
            console.log(`TelegramWorker::Найдено ${messages.length} сообщений для отправки`);
            
            for (const message of messages) {
                const success = await sendTelegramMessage(message);
                if (success) {
                    console.log(`TelegramWorker::Сообщение ${message.tl_id} отправлено в чат ${message.chat_id}`);
                }
            }
        }
    } catch (error) {
        console.error('TelegramWorker::Критическая ошибка:', error);
    }
}


// Запускаем проверку каждые 15 секунд
const CRON_INTERVAL = '*/15 * * * * *';
cron.schedule(CRON_INTERVAL, processPendingMessages);

console.log('TelegramWorker::Запущен и проверяет сообщения для отправки');