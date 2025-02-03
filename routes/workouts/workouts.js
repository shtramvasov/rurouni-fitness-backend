const express = require('express');
const router = express.Router();
const { connection } = require('../../middlewares/connection');
const WorkoutsController = require('./workouts.controller');

// Получить список тренировок
router.get('/', connection (async (req, res) => {
  const { limit, offset, date_start_tz, date_end_tz } = req.query;
  const { user_id } = req.user;
  const connection = res.locals.pg;

  const workoutsList = await WorkoutsController.getWorkouts(connection, { limit, offset, date_start_tz, date_end_tz, user_id });

  res.json(workoutsList);
}));

// Получить детализацию тренировки
router.get('/:workout_id', connection (async (req, res) => {
  const { workout_id } = req.params;
  const { user_id } = req.user;
  const connection = res.locals.pg;

  const workout = await WorkoutsController.getWorkout(connection, { workout_id, user_id });
  if (!workout) return res.status(404).json({ message: 'Тренировка не найдена' });

  res.json(workout);
}));

module.exports = router;