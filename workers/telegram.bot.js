const TelegramBotApi = require('node-telegram-bot-api');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') })
const pool = require('../db-connection');

class TelegramBot {
  constructor(app) {
    // Инициализация бота с webhook
    this.app = app;
    this.bot = new TelegramBotApi(process.env.TELEGRAM_BOT_TOKEN);
    this.webhook_url = `${process.env.HOSTNAME}api/webhooks/telegram`
    
    // Настройка вебхука
    this.setupWebhook(app);
    this.setupHandlers(app);
  }

  setupWebhook(app) {
    this.bot.setWebHook(this.webhook_url)
      .then(() => console.log(`Webhook установлен: ${this.webhook_url}`))
      .catch(err => console.error('Ошибка настройки webhook'));

    // Обработчик вебхука
    app.post('/api/webhooks/telegram', (req, res) => {
      this.bot.processUpdate(req.body);
      res.sendStatus(200);
    });
  }

  setupHandlers() {
    this.bot.onText(/\/verify (.+)/, async (msg, token) => {
      console.log(`Получена команда /verify от пользователя ${msg.from.username}`);
    
      if(!token[1]) {
        console.log('Нет токена', token)
        return;
      };

      // Начинаем транзакцию
      const client = await pool.connect();

      try {
        await client.query('BEGIN');

        const userData = (await client.query(`select user_id from users where telegram = $1`, [token[1]])).rows[0]

        if(!userData) throw new Error('Пользователь не найден')
          
        await client.query(
          `UPDATE users SET telegram = $2, telegram_id = $3 WHERE user_id = $1`,
          [userData.user_id, msg.from.username, msg.from.id]
        );

        await client.query('COMMIT');
        console.log(`Телеграм успешно привязан для пользователя ${msg.from.username}`)
      } catch (error) {
          console.log('error', error)
          await client.query('ROLLBACK');
      } finally {
          client.release();
      }
    });

    this.bot.on('polling_error', (error) => {
      console.error('Polling error:');
    });
  }
}

module.exports = TelegramBot;