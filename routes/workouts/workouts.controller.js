const { PAGINATION } = require("../../utils");

class WorkoutsController {

  static async getWorkouts(connection, { limit = PAGINATION.DEFAULT_LIMIT, offset = PAGINATION.DEFAULT_OFFSET, user_id }) {
    try {
      const result = await connection.query(
        `select * from workouts where user_id = $3 limit $1 offset $2`,
        [limit, offset, user_id]
      );

      return result.rows
    } catch (error) {
        throw error;
    }
  }

  static async getWorkout(connection, { workout_id, user_id }) {
    try {
      const result = await connection.query(`
        select 
          w.*,
          json_agg(
            json_build_object(
              'workout_exercise_id', we.workout_exercise_id,
              'exercise_id', we.exercise_id,
              'sets', we."sets",
              'reps', we.reps,
              'weight', we.weight
            ) order by we.workout_exercise_id
          ) as exercises
        from workouts w
          left join workout_exercises we on we.workout_id = w.workout_id
        where w.workout_id = $1 and w.user_id = $2
        group by w.workout_id
        order by w.workout_id`,
        [workout_id, user_id]
      );

      return result.rows[0]
    } catch (error) {
        throw error;
    }
  }

}

module.exports = WorkoutsController;