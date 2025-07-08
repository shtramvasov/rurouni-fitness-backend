// workers/telegram.bot.js
const TelegramBotApi = require('node-telegram-bot-api');
require('dotenv').config();

class TelegramBot {
  constructor(app) {
    this.bot = new TelegramBotApi(process.env.TELEGRAM_BOT_TOKEN);
    this.setupWebhook(app);   
    this.setupHandlers();
  }

  setupWebhook(app) {
    const webhookUrl = `${process.env.HOSTNAME}api/webhooks/telegram`;
    this.bot.setWebHook(webhookUrl)
      .then(() => console.log(`Webhook установлен: ${webhookUrl}`))
      .catch(err => console.error('Ошибка настройки webhook'));
  }

  setupHandlers() {
    this.bot.onText(/\/verify/, (msg) => {
      const chat_id= msg.chat.id;
      const username = msg.from.username;
      
      // 1. Отправляем ответ пользователю
      this.bot.sendMessage(
        chat_id,
        `✅ Ваш Telegram аккаунт @${username} получен!\nID чата: ${chat_id}`
      );
    });
  }



  async sendMessage(chat_id, text) {
    if(!chat_id || !text) {
      console.log('TelegramBot:: Невозможно отправить сообщение, отсутствуют параметры')
      return
    }

    this.bot.sendMessage(chat_id, text)
  }
}

module.exports = TelegramBot;