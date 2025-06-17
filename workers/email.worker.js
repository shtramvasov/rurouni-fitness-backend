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
      SELECT user_id, username, password_raw, email, display_name
      FROM users 
      WHERE welcome_email = false
      ORDER BY created_on_tz desc
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
async function sendWelcomeEmail(user) {
  try {
    const username = user.display_name ?? user.username

    // Письмо пользователю
    const mailOptions = {
      from: `"Rurouni Fitness" <${process.env.EMAIL_TRANSPORT}>`,
      to: user.email,
      subject: 'Добро пожаловать!',
      text: `
        Отличных тренировок, ${username}!
        
        Логин: ${user.username}
        Пароль: ${user.password_raw}
        
        С уважением,
        Команда Rurouni Fitness
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2d3748;">Добро пожаловать в Rurouni Fitness!</h1>
          <p>Отличных тренировок, ${username}!</p>
          
          <div style="background: #f7fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Логин:</strong> ${user.username}</p>
            <p><strong>Пароль:</strong> ${user.password_raw}</p>
          </div>
          
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
            <p>С уважением,<br>Команда Rurouni Fitness</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    
    // Уведомление разработчику
    const devMailOptions = {
      from: `"Система уведомлений ${process.env.EMAIL_TRANSPORT}" <${process.env.EMAIL_TRANSPORT}>`,
      to: process.env.EMAIL_DEV,
      subject: `В системе появился новый пользователь: ${username}`,
      text: `В системе появился новый пользователь: ${username}`,
    };
    
    await transporter.sendMail(devMailOptions);
    
    // Помечаем пользователя как обработанного
    await pool.query(
      'UPDATE users SET welcome_email = TRUE WHERE user_id = $1', 
      [user.user_id]
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
        const success = await sendWelcomeEmail(user);
        if (success) console.log(`EmailWorker::Успешно отправлено приветственное письмо для ${user.email}`);       
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
