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
  
  if(workout.weight > exercise.personal_record) exercise.personal_record = workout.weight
  };

  exercise.current_weight = exercisesHistory.at(0).weight;
}

module.exports = { assignExerciseHistory }