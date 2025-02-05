function assignExerciseHistory(exercise, exercisesHistory) {

  for (workout of exercisesHistory) {
    exercise.history.push({
      history_id:       workout.workout_exercise_id,
      created_on_tz:    workout.created_on_tz,
      weight:           workout.weight,
      sets:             workout.sets,
      reps:             workout.reps
    });

  exercise.total_calories += Number(exercise.calories_per_rep) * (Number(workout.reps) * Number(workout.sets));
  
  if(Number(workout.weight) > Number(exercise.personal_record || 0)) exercise.personal_record = Number(workout.weight)
  };

  exercise.current_weight = Number(exercisesHistory.at(0).weight);
}

function mapMuscleGroup(muscle_group) {
  const muscleGroupMap = {
    biceps:        'Бицепс',
    triceps:       'Трицепс',
    shoulders:    'Плечи',
    chest:        'Грудь',
    legs:         'Ноги',
    back:         'Спина'
  };

  return muscleGroupMap[muscle_group.toLowerCase()] || null
}

module.exports = { assignExerciseHistory, mapMuscleGroup }