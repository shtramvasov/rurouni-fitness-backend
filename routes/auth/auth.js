const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('../../middlewares/passport-strategy');
const { connection, transaction } = require('../../middlewares/connection');
const UsersController = require('../users/users.controller');
const TrainingProgramsController = require('../training_programs/training_programs.controller');
const EmailController = require('../../controllers/EmailController')
const EMAIL_TEMPLATE = require('../../controllers/email.templates')

router.post('/login', transaction (async (req, res, next) => {
  let { username, password } = req.body;
  const connection = res.locals.pg;

  if (!username) return res.status(404).json({ message: 'Не передан юзернейм' });
  if (!password) return res.status(404).json({ message: 'Не передан пароль' });

  passport.authenticate('local', (err, user) => {
    if (err) return next(err);    
    if (!user) return res.status(401).json({ message: 'Неверный логин или пароль' });

    req.login(user, (err) => {
      if (err) return next(err);

      connection.query(`update users set last_login_on_tz = now() where user_id = $1`, [req.user.user_id])

      return res.json({
				user: { 
          user_id:            req.user.user_id,
          username:           req.user.username, 
          display_name:       req.user.display_name, 
          email:              req.user.email,
          avatar_url:         req.user.avatar_url,
          created_on_tz:      req.user.created_on_tz,
          updated_on_tz:      req.user.updated_on_tz,
          last_login_on_tz:   req.user.last_login_on_tz,
          gender:             req.user.gender,
        },
				isAuth: true,
			});
    });
  })(req, res, next);
}));

router.post('/register', transaction (async (req, res) => {
  const { username, password, email, display_name } = req.body;
  const connection = res.locals.pg;

  if (!username)  return res.status(404).json({ message: 'Не передан юзернейм'});
  if (!email)     return res.status(404).json({ message: 'Не передана почта' });
  if (!password)  return res.status(404).json({ message: 'Не передан пароль' });

  const hasRegistered = await UsersController.getUser(connection, { username, email });
  
  if(hasRegistered) return res.status(400).json({message: 'Такой пользователь уже существует'});
  
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await UsersController.postUser(connection, { username, password, passwordHash, email, display_name });

  // Записываем в лог отправки почты
  const { welcome } = EMAIL_TEMPLATE;

  await EmailController.createLog(connection, { 
    user_id:        user.user_id, 
    email:          user.email, 
    subject:        welcome.subject,
    payload_text:   welcome.text({...user, password_raw: password}), 
    payload_html:   welcome.html({...user, password_raw: password})
  })

  // #TODO: убрать после добавления фичи: Программы тренировок, пока что заполнять пресетом
  await TrainingProgramsController.postTrainingProgram(connection, { user_id: user.user_id }) 

  // После регистрации сразу логиним пользователя
  req.login(user, (err) => {
    if (err) return res.status(500).json({ message: 'Ошибка аутентификации после регистрации' });

    res.json({
      user: { 
        user_id:            req.user.user_id, 
        username:           req.user.username, 
        display_name:       user.display_name, 
        email:              user.email,
        avatar_url:         user.avatar_url,
        created_on_tz:      user.created_on_tz,
        updated_on_tz:      user.updated_on_tz,
        last_login_on_tz:   user.last_login_on_tz,
        gender:             user.gender,
      },
      isAuth: true,
    });
  });
}));

router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ logout: true });
  });
});

router.get('/status', connection (async (req, res) => {
  if(req.isAuthenticated()) {  
    const { user_id, username, email, created_on_tz, last_login_on_tz, gender, avatar_url, display_name } = req.user;
    
    return res.json({
      isAuth: true,
      user: {
        user_id,
        username,
        email,
        created_on_tz,
        last_login_on_tz,
        gender,
        avatar_url,
        display_name
      }
    })
  }

  res.json({
    isAuth: false,
    user: []
  })
}));

module.exports = router;