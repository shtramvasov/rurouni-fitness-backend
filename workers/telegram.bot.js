const TelegramBotApi = require('node-telegram-bot-api');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') })

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
    this.bot.onText(/\/verify/, async (msg) => {
      console.log(`Получена команда /verify от пользователя ${msg.from.username}`);

      const req = { 
        method: 'POST',
        url: `${this.webhook_url}/verify`,
        body: { chat_id: msg.chat_id, username: msg.from.username },
        headers: { 'content-type': 'application/json' },
        connection: {},
        socket: {},
        res: { end: () => {} }
      }

      const res = {
      json: () => {},
      status: () => res,
      sendStatus: () => {}
    };

      this.app._router.handle(req, res, (err) => {
        if (err) console.error('Ошибка в роуте /verify', err);
      });
    
      // app.post('/api/webhooks/telegram/verify', (req, res) => {
      //   this.bot.processUpdate(req);
      //   res.sendStatus(200);
      // });

      // this.bot.sendMessage(msg.chat.id, "✅ Бот успешно работает через webhook!");
    });

    this.bot.on('polling_error', (error) => {
      console.error('Polling error:');
    });
  }
}

module.exports = TelegramBot;