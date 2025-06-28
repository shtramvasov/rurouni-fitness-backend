const express = require('express');
const router = express.Router();
const { connection, transaction } = require('../../middlewares/connection');
const UsersController = require('./users.controller');
const EmailController = require('../../controllers/EmailController')
const EMAIL_TEMPLATE = require('../../controllers/email.templates')

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

module.exports = router;