const express = require('express');
const router = express.Router();
const { connection, transaction } = require('../../middlewares/connection');
const UsersController = require('./users.controller');
const EmailController = require('../../controllers/EmailController')
const UserSettingsController = require('../../controllers/UserSettingsController');
const EMAIL_TEMPLATE = require('../../controllers/email.templates');


// Получаем активность логинов пользователя
router.get('/logins', connection (async (req, res) => {
  const connection = res.locals.pg;

  const recentLogins = await UsersController.getRecentLogins(connection, { user_id: req.user.user_id });

  res.json(recentLogins);
}));


// Обновление профиля пользователя
router.put('/', transaction (async (req, res) => {
  const { display_name, gender, avatar_url, old_password, new_password } = req.body;
  const connection = res.locals.pg;

  const user = await UsersController.updateUser(connection, req.user, { display_name, gender, avatar_url, old_password, new_password });

  if(old_password && new_password) {
    // Записываем в лог отправки почты
    const { changePassword } = EMAIL_TEMPLATE;

    await EmailController.createLog(connection, { 
      user_id:        user.user_id, 
      email:          user.email, 
      subject:        changePassword.subject,
      payload_text:   changePassword.text({...user, password_raw: new_password}), 
      payload_html:   changePassword.html({...user, password_raw: new_password})
    })
  }

  res.json(user);
}));


// Сбросить пароль
router.post('/reset-password', transaction (async (req, res) => {
  const connection = res.locals.pg;
  const random_password = await UsersController.generatePassword();

  await UsersController.updateUser(connection, req.user, { old_password: req.user.password_raw, new_password: random_password })

  // Записываем в лог отправки почты
  const { resetPassword } = EMAIL_TEMPLATE;

  await EmailController.createLog(connection, { 
    user_id:        req.user.user_id, 
    email:          req.user.email, 
    subject:        resetPassword.subject,
    payload_text:   resetPassword.text({...req.user, password_raw: random_password}), 
    payload_html:   resetPassword.html({...req.user, password_raw: random_password})
  })

  res.json({ random_password })
}));


// Подтвердить (email или telegram)
router.get('/verify', connection (async (req, res) => {
  const connection = res.locals.pg;
  const { method } = req.query

  const token = await UsersController.generatePassword();

  await UsersController.verifyTelegram(connection, { user_id: req.user.user_id, token })

  // Записываем в лог отправки почты
  const { verifyTelegram } = EMAIL_TEMPLATE;

  await EmailController.createLog(connection, { 
    user_id:        req.user.user_id, 
    email:          req.user.email, 
    subject:        verifyTelegram.subject,
    payload_text:   verifyTelegram.text({...req.user, token}), 
    payload_html:   verifyTelegram.html({...req.user, token})
  }) 

  res.json({ ok: true });
}));


// Обновить настройки пользователя
router.put('/settings', transaction (async (req, res) => {
  const { news_updates, personal_statistics, workout_reminders, security_alerts } = req.body;
  const connection = res.locals.pg;

  await UserSettingsController.updateUserSettings(connection, req.user, { news_updates, personal_statistics, workout_reminders, security_alerts })

  res.json({ ok: true })
}));

module.exports = router;