const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') })
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const pool = require('../db-connection')

// Настройка почтового клиента
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_TRANSPORT,
    pass: process.env.EMAIL_PASSWORD,
  },
});


// Функция для получения новых пользователей
async function getNewUsers() {
  try {
    const query = `
      SELECT e.el_id, e.user_id, e.email, e.subject, e.payload_text, e.payload_html, u.password_raw, u.username, u.display_name
      FROM email_log e
      LEFT JOIN users u on u.user_id = e.user_id
      WHERE e.sent_on_tz is null
      ORDER BY e.created_on_tz DESC
      LIMIT 50
    `;
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('EmailWorker::Ошибка при получении новых пользователей:', error);
    return [];
  }
}


// Функция для отправки email
async function sendEmail(user) {
  try {
    // Письмо пользователю
    const mailOptions = {
      from: `"Rurouni Fitness" <${process.env.EMAIL_TRANSPORT}>`,
      to: user.email,
      subject: user.subject,
      text: user.payload_text,
      html: user.payload_html
    };

    await transporter.sendMail(mailOptions);
    
    // Уведомление разработчику
    if(user.subject.includes('Добро пожаловать!')) {
      const devMailOptions = {
        from: `"Система уведомлений ${process.env.EMAIL_TRANSPORT}" <${process.env.EMAIL_TRANSPORT}>`,
        to: process.env.EMAIL_DEV,
        subject: `В системе появился новый пользователь: ${user.username}`,
        text: `В системе появился новый пользователь: ${user.username}`,
      };

      await transporter.sendMail(devMailOptions);
    }
    
    
    // Помечаем пользователя как обработанного
    await pool.query(
      'UPDATE email_log SET sent_on_tz = now() WHERE el_id = $1', 
      [user.el_id]
    );
    
    return true;
  } catch (error) {
    console.error('Ошибка при отправке email:', error);
    return false;
  }
}


// Основная функция воркера
async function processNewUsers() {
  try {
    console.log('EmailWorker::Проверка новых пользователей...', new Date().toISOString());
    const newUsers = await getNewUsers();
    
    if (newUsers.length > 0) {
      console.log(`EmailWorker::Найдено ${newUsers.length} новых пользователей`);
      
      for (const user of newUsers) {
        const success = await sendEmail(user);
        if (success) console.log(`EmailWorker::Успешно отправлено письмо для ${user.email}`);       
      }
    }
  } catch (error) {
    console.error('EmailWorker::Критическая ошибка в процессе отправки email:', error);
  }
}


// Запускаем проверку каждые 15 секунд
const CRON_INTERVAL = '*/15 * * * * *';
cron.schedule(CRON_INTERVAL, processNewUsers);

console.log(`EmailWorker::Запущен и проверяет новых пользователей`);
