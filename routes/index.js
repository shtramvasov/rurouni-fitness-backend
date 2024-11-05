const express = require('express');
const router = express.Router();

// Упражнения
const execisesRouter = require('./exercises/exercises');

// Программы тренировок
const trainingProgramsRouter = require('./training_programs/training_programs');

// Тренировки
const workoutsRouter = require('./workouts/workouts');

router.use('/exercises',          execisesRouter);
router.use('/workouts',           workoutsRouter);
router.use('/training_programs',  trainingProgramsRouter);

module.exports = router;