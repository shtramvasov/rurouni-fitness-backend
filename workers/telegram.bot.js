const TelegramBotApi = require('node-telegram-bot-api');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') })

class TelegramBot {
  constructor(app) {
    // Инициализация бота с webhook
    this.bot = new TelegramBotApi(process.env.TELEGRAM_BOT_TOKEN);
    this.webhook_url = `${process.env.HOSTNAME}api/webhooks/telegram`
    
    // Настройка вебхука
    this.setupWebhook(app);
    this.setupHandlers();
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

      console.log('/verify')
      console.log('app', app)
      console.log('this app', this.app)

      return;
    
      app.post('/api/webhooks/telegram/verify', (req, res) => {
        this.bot.processUpdate(msg);
        res.sendStatus(200);
      });

      // this.bot.sendMessage(msg.chat.id, "✅ Бот успешно работает через webhook!");
    });

    this.bot.on('polling_error', (error) => {
      console.error('Polling error:');
    });
  }
}

module.exports = TelegramBot;