const express = require('express');
const router = express.Router();
const { connection, transaction } = require('../../middlewares/connection');
const UsersController = require('./users.controller');

// Обновление профиля пользователя
router.put('/', transaction (async (req, res) => {
  const { display_name, gender } = req.body;
  const { user_id } = req.user;
  const connection = res.locals.pg;

  const user = await UsersController.updateUser(connection, { user_id, display_name, gender });

  res.json(user);
}));


module.exports = router;