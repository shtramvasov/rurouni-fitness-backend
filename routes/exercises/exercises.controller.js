const { PAGINATION } = require("../../utils");
const { mapMuscleGroup } = require("../../utils/exercises");

class ExercisesController {

  static async getExercises(connection, { limit = PAGINATION.DEFAULT_LIMIT, offset = PAGINATION.DEFAULT_OFFSET, search, order }, user_id) {
    try {
      let params = [limit, offset, user_id]
      let sql = `
        select 
          e.*,
          (
            select max(w.created_on_tz)
            from workout_exercises we
              left join workouts w on w.workout_id = we.workout_id
            where we.exercise_id = e.exercise_id and w.user_id = $3
          ) created_on_tz
        from exercises e
      `;

      if(search) {
        params.push(`%${search.toLowerCase()}%`)
        sql += ` where lower(e.name) like $${params.length} or lower(e.muscle_group) like $${params.length}`
      }

      if(order) {
        params.push(mapMuscleGroup(order).toLowerCase())
        sql += ` order by case when lower(e.muscle_group) = $${params.length} THEN 0 ELSE 1 END, created_on_tz NULLS LAST`
      } else {
        sql += ` order by created_on_tz nulls last`
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

  static async getMuscleGroupUsedCount(connection, { date_start_tz, date_end_tz }, user_id) {
    try {
      let params = [user_id]
      let sql = `
        select 
	          e.muscle_group          as muscle_group,
	          count(we.exercise_id)   as count
        from workout_exercises we 
	          left join workouts w on w.workout_id = we.workout_id
	          left join exercises e on e.exercise_id = we.exercise_id
        where w.user_id = $1 `;

      if(date_start_tz) {
        params.push(date_start_tz)
        sql += ` and w.created_on_tz >= $${params.length} `
      }

      if(date_end_tz) {
        params.push(date_end_tz)
        sql += ` and w.created_on_tz <= $${params.length} `
      }

      sql += `group by e.muscle_group`

      const result = await connection.query(sql, params);
      
      return result.rows;
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