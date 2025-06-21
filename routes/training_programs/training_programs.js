const express = require('express');
const router = express.Router();
const { connection, transaction } = require('../../middlewares/connection');
const TrainingProgramsController = require('./training_programs.controller');

// Получить список программ тренировок
router.get('/', connection (async (req, res) => {
  const { limit, offset, is_active, search } = req.query;
  const { user_id } = req.user;

  const connection = res.locals.pg;
  
  const trainingProgramsList = await TrainingProgramsController.getTrainingPrograms(connection, { limit, offset, user_id, is_active, search });

  res.json(trainingProgramsList);
}));


// Изменить программу тренировок
router.put('/:program_id', transaction (async (req, res) => {
  const { name, description, is_active, exercises } = req.body;
  const { user_id } = req.user;
  const { program_id } = req.params
  const connection = res.locals.pg;

  await TrainingProgramsController.updateTrainingProgram(connection, { program_id, user_id, name, description, is_active, exercises });

  res.json({ ok: true });
}));

module.exports = router;