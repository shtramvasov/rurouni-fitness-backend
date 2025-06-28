const express = require('express');
const router = express.Router();

// Упражнения
const execisesRouter = require('./exercises/exercises');

// Программы тренировок
const trainingProgramsRouter = require('./training_programs/training_programs');

// Тренировки
const workoutsRouter = require('./workouts/workouts');

// Пользователи
const usersRouter = require('./users/users');

// Файлы
const filesRouter = require('./files/files');


router.use('/users',              usersRouter);
router.use('/exercises',          execisesRouter);
router.use('/workouts',           workoutsRouter);
router.use('/training_programs',  trainingProgramsRouter);
router.use('/files',              filesRouter);

module.exports = router;