const express = require('express');
const router = express.Router();
const { connection } = require('../../middlewares/connection');
const ExercisesController = require('./exercises.controller');
const { assignExerciseHistory } = require('../../utils');

// Получить список упражнений
router.get('/', connection (async (req, res) => {
  const { limit, offset, search, order } = req.query;
  const { user_id } = req.user;
  const connection = res.locals.pg;


  const exercisesList = await ExercisesController.getExercises(connection, { limit, offset, search, order }, user_id);

  res.json(exercisesList)
}));

// Получить детализацию упражнения
router.get('/:exercise_id', connection (async (req, res) => {
  const { exercise_id } = req.params
  const { user_id } = req.user;
  const connection = res.locals.pg;

  const exercise = await ExercisesController.getExercise(connection, { exercise_id });
  if (!exercise) return res.status(404).json({ message: 'Упражнение не найдено' });

  // Ищем историю тренировок для упражнения
  const exerciseHistory = await ExercisesController.getExerciseHistory(connection, { exercise_id, user_id });

  // Присваиваем значения, если нашли историю тренировок
  exercise.current_weight     = null;
  exercise.personal_record    = null;
  exercise.total_calories     = 0;
  exercise.history            = [];

  if (exerciseHistory.length) assignExerciseHistory(exercise, exerciseHistory);

  res.json(exercise);
}));


module.exports = router;