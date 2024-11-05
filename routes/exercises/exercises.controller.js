const { PAGINATION } = require("../../utils");

class ExercisesController {

  static async getExercises(connection, { limit = PAGINATION.DEFAULT_LIMIT, offset = PAGINATION.DEFAULT_OFFSET, search }) {
    try {
      let params = [limit, offset]
      let sql = `select * from exercises`

      if(search) {
        sql += ` where lower(name) like $3 or lower(muscle_group) like $3`
        params.push(`%${search.toLowerCase()}%`)
      }
      sql += ` limit $1 offset $2 `

      const result = await connection.query(sql, params);

      return result.rows
    } catch (error) {
        throw error;
    }
  }

  static async getExercise(connection, { exercise_id }) {
    try {
      const result = await connection.query(`
        select * from exercises where exercise_id = $1`,
        [exercise_id]
      );
      
      return result.rows[0];
    } catch (error) {
        throw error;
    }
  }

  static async getExerciseHistory(connection, { exercise_id, user_id }) {
    try {
      const result = await connection.query(`
        select 
          we.workout_exercise_id,
          we.sets,
          we.reps,
          we.weight,
          w.created_on_tz
        from workout_exercises we
        join workouts w on we.workout_id = w.workout_id
        where we.exercise_id = $1 and w.user_id = $2
        order by w.created_on_tz desc`,
        [exercise_id, user_id]
      );

      return result.rows;
    } catch (error) {
        throw error;
    }
  }
}

module.exports = ExercisesController;