const { PAGINATION } = require("../../utils");

class WorkoutsController {

  static async getWorkouts(connection, { limit = PAGINATION.DEFAULT_LIMIT, offset = PAGINATION.DEFAULT_OFFSET, user_id, date_start_tz, date_end_tz }) {
    try {
      let params = [limit, offset, user_id]

      let sql = `select * from workouts where user_id = $3 `;

      if(date_start_tz) {
        params.push(date_start_tz)
        sql += ` and created_on_tz >= $${params.length}`
      }

      if(date_end_tz) {
        params.push(date_end_tz)
        sql += ` and created_on_tz <= $${params.length}`
      }

      sql += ` order by created_on_tz desc limit $1 offset $2`

      const result = await connection.query(sql, params);

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
              'exercise_name', e.name,
              'exercise_id', we.exercise_id,
              'muscle_group', e.muscle_group,
              'unit', e.unit,
              'sets', we."sets",
              'reps', we.reps,
              'weight', we.weight
            ) order by we.workout_exercise_id
          ) as exercises
        from workouts w
          left join workout_exercises we on we.workout_id = w.workout_id
          left join exercises e on e.exercise_id = we.exercise_id
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

  static async postWorkout(connection, { title, created_on_tz, exercises, user_id }) {
    try {

      // Записываем тренировку в журнал
      const { workout_id } = (await connection.query(
        `insert into workouts (user_id, title, created_on_tz) values($1, $2, coalesce($3, now())) returning workout_id`,
        [user_id, title, created_on_tz || null]
      )).rows[0];

      // Добавляем упражнения к тренировке
      if (exercises && exercises.length > 0) {
        let params = [workout_id]
        let entries = [];
        let sql = `insert into workout_exercises (workout_id, exercise_id, weight, sets, reps) values `

        for(const exercise of exercises) {
          const { exercse_id, weight, sets, reps } = exercise;

          entries.push(` ($1, $${params.length + 1}, $${params.length + 2}, $${params.length + 3}, $${params.length + 4}) `)
          params.push(exercse_id, weight, sets, reps)
        }

        sql += entries.join(', ')

        // Сохраняем в БД
        await connection.query(sql, params);
      }

      
      return { ok: true, workout_id: workout_id };

    } catch (error) {
        throw error;
    }
  }

}

module.exports = WorkoutsController;