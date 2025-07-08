const TelegramBotApi = require('node-telegram-bot-api');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') })

class TelegramBot {
  constructor(app) {
    // Инициализация бота с webhook
    this.bot = new TelegramBotApi(process.env.TELEGRAM_BOT_TOKEN);
    
    // Настройка вебхука
    this.setupWebhook(app);
    this.setupHandlers();
  }

  setupWebhook(app) {
    const webhookUrl = `${process.env.HOSTNAME}api/webhooks/telegram`;
    this.bot.setWebHook(webhookUrl)
      .then(() => console.log(`Webhook установлен: ${webhookUrl}`))
      .catch(err => console.error('Ошибка настройки webhook'));

    // Обработчик вебхука
    app.post('/api/webhooks/telegram', (req, res) => {
      this.bot.processUpdate(req.body);
      res.sendStatus(200);
    });
  }

  setupHandlers() {
    this.bot.onText(/\/verify/, (msg) => {
      console.log(msg)
      this.bot.sendMessage(msg.chat.id, "✅ Бот успешно работает через webhook!");
    });

    this.bot.on('polling_error', (error) => {
      console.error('Polling error:');
    });
  }
}

module.exports = TelegramBot;