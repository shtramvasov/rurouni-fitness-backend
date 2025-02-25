const { PAGINATION } = require("../../utils");

class TrainingProgramsController {

  static async getTrainingPrograms(connection, { limit = PAGINATION.DEFAULT_LIMIT, offset = PAGINATION.DEFAULT_OFFSET, user_id, is_active }) {
    try {
      let params = [limit, offset, user_id];
      let sql = `
        select 
            tp.program_id,
            tp."name",
            tp.description,
            tp.is_active,
            json_agg(
              json_build_object(
                'exercise_id', e.exercise_id,
                'sets', pe."sets",
                'reps', pe.reps,
                'name', e."name",
                'muscle_group', e.muscle_group,
                'unit', e.unit,
                'recent_sets', recent.sets,
                'recent_reps', recent.reps,
                'recent_weight', recent.weight,
                'recent_created_on_tz', recent.created_on_tz
              )
            ) as exercises
          from training_programs tp
            left join program_exercises pe on pe.program_id = tp.program_id
            left join exercises e on e.exercise_id = pe.exercise_id
            left join lateral (
              select * from workout_exercises we 
              join workouts w on w.workout_id = we.workout_id
              where we.exercise_id = e.exercise_id and w.user_id = $3
              order by w.created_on_tz desc
              limit 1
            ) as recent on true
          where tp.user_id = $3
        `;

        if(is_active) {
          params.push(is_active)
          sql += ` and tp.is_active = $${params.length} `
        }

        sql += `
          group by tp.program_id
          order by tp.program_id
          limit $1 offset $2`;

      const result = await connection.query(sql, params)

      return result.rows
    } catch (error) {
        throw error;
    }
  }

  static async postTrainingProgram(connection, { user_id }) {
    try {

      const trainingProgramm = (await connection.query(`
        insert into training_programs (user_id, name, description, is_active, created_on_tz) values (
          $1, 
          'Начальная программа тренировок', 
          'Рекомендованные упражнения для новичка',
          true,
          now()
        ) returning *`, [user_id]
      )).rows[0];

      await connection.query(`
        insert into program_exercises (program_id, exercise_id, sets, reps) 
        values 
          ($1, 'bench-press', 3, 8),
          ($1, 'pulldown', 3, 8),
          ($1, 'squat', 3, 8),
          ($1, 'tricep-cable', 3, 10),
          ($1, 'bicep-dumbbell', 3, 10),
          ($1, 'lateral-raises-dumbbell', 3, 10)`
        , [trainingProgramm.program_id]
      );     

      return true;
    } catch (error) {
        throw error;
    }
  }

}

module.exports = TrainingProgramsController;