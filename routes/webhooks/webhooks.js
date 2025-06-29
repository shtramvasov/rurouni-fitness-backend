const express = require('express');
const router = express.Router();
const { connection } = require('../../middlewares/connection');


router.post('/telegram', (req, res) => {
  global.telegramBot.bot.processUpdate(req.body);
  console.log('telegram webhook body', req.body)
  res.sendStatus(200);
});

module.exports = router;