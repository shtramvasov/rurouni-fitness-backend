const { parseUserAgent } = require("../utils/auth")

const TELEGRAM_TEMPLATE = {
  resetPassword: (req) => `
    🔐 *Изменение пароля* 

    Ваш пароль был сброшен системой.  

    📅 *Дата:*  ${new Date().toLocaleString()}  

    🌐 *IP-адрес:* ${req.headers['x-forwarded-for']?.split(',')[0] || 'Неизвестно'}  

    🖥 *Устройство:* ${parseUserAgent(req.headers['user-agent'])}  

    ✅ Это вы? Все в порядке!  
    🚨 Нет? Немедленно смените пароль и обратитесь в поддержку.
  `,
  changePassword: (req) => `
    🔒 *Пароль изменен*  

    Вы успешно изменили пароль от аккаунта.  

    📅 *Дата изменения:* ${new Date().toLocaleString()}  

    🌐 *IP-адрес:* ${req.headers['x-forwarded-for']?.split(',')[0] || 'Неизвестно'}  

    🖥 *Устройство:* ${parseUserAgent(req.headers['user-agent'])}  

    ✅ Это вы? Все в порядке!  
    🚨 Нет? Немедленно смените пароль и обратитесь в поддержку.
  `
}

module.exports = TELEGRAM_TEMPLATE