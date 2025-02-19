const express = require('express');
const router = express.Router();
const { connection } = require('../../middlewares/connection');
const TrainingProgramsController = require('./training_programs.controller');

// Получить список программ тренировок
router.get('/', connection (async (req, res) => {
  const { limit, offset, is_active } = req.query;
  const { user_id } = req.user;

  const connection = res.locals.pg;
  
  const trainingProgramsList = await TrainingProgramsController.getTrainingPrograms(connection, { limit, offset, user_id, is_active });

  res.json(trainingProgramsList);
}));

module.exports = router;