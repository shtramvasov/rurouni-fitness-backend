const { PAGINATION } = require("../../utils");

class TrainingProgramsController {

  static async getTrainingPrograms(connection, { limit = PAGINATION.DEFAULT_LIMIT, offset = PAGINATION.DEFAULT_OFFSET, user_id }) {
    try {
      const result = await connection.query(`
        select 
          tp.program_id,
          tp."name",
          tp.description,
          --tp.is_active,
          json_agg(
            json_build_object(
              'exercise_id', e.exercise_id,
              'sets', pe."sets",
              'reps', pe.reps,
              'name', e."name",
              'muscle_group', e.muscle_group,
              'unit', e.unit
            )
          ) as exercises
        from training_programs tp
          left join program_exercises pe on pe.program_id = tp.program_id
          left join exercises e on e.exercise_id = pe.exercise_id
        where user_id = $3
        group by tp.program_id
        order by tp.program_id
        limit $1 offset $2`,
        [limit, offset, user_id]
      )

      return result.rows
    } catch (error) {
        throw error;
    }
  }

}

module.exports = TrainingProgramsController;