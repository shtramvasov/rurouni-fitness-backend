const express = require('express');
const router = express.Router();
const { connection } = require('../../middlewares/connection');


router.post('/telegram', (req, res) => {
  global.telegramBot.bot.processUpdate(req.body);
  res.sendStatus(200);
});


// Подтверждение телеграм аккаунта
router.post('/telegram/verify',connection, async (req, res) => {

  const { chat_id } = req.body

  console.log('/telegram/verify', chat_id)

  // await global.telegramBot.sendMessage(
  //     5094624456, 
  //     `Ваш код: ${123}\n\nКод действителен 5 минут.`
  //   );

  res.json({ chat_id: chat_id });
    
});

module.exports = router;