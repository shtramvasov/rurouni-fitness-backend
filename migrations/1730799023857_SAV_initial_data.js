module.exports.up = async (connection) => {
        try {
          await connection.query(`
            ----users
            INSERT INTO users (username, password, email, created_on_tz) 
              VALUES 
                ('dev', '$2b$10$RlgGfHxZI6AH5gXt36FaheSn8M4tL8a8vmJ87H/eYnWRCIM3UmOQ2', 'dev@email.com', '2024-08-09 13:23:44.428+05:00');

            ----workouts
            INSERT INTO workouts (user_id, created_on_tz, title)
              VALUES 
                (1, '2024-08-09 13:25:08.001 +05:00', 'День Груди'),
                (1, '2024-08-09 13:30:57.957 +05:00', 'День Груди');

            ----exercises
            INSERT INTO exercises (exercise_id, name, muscle_group, calories_per_rep, unit)
              VALUES 
                ('bench-press', 'Жим лежа', 'грудь', 2, 'кг'),
                ('deadlift', 'Становая тяга', 'спина', 3, 'кг'),
                ('squat', 'Присед', 'ноги', 3, 'кг');

            ----workout_exercises
            INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, weight)
              VALUES 
                (1, 'bench-press', 3, 5, 100.00),
                (1, 'deadlift', 3, 5, 120.00),
                (2, 'bench-press', 3, 5, 102.00),
                (2, 'squat', 3, 5, 110.00);

            ----training_programs
            INSERT INTO training_programs (user_id, name, description, is_active, created_on_tz)
              VALUES 
                (1, 'День Груди', 'программа тренировок', true, '2024-08-09 13:26:00.876 +05:00');

            ----program_exercises
            INSERT INTO program_exercises (program_id, exercise_id, sets, reps)
              VALUES 
                (1, 'bench-press', 3, 5), 
                (1, 'squat', 5, 7);
          `);
        } catch (error) {
            throw error;
        }
      };
      
      module.exports.down = async (connection) => {
        try {
          await connection.query(`
            DELETE FROM program_exercises;
            DELETE FROM workout_exercises;
            DELETE FROM training_programs;
            DELETE FROM workouts;
            DELETE FROM exercises;
            DELETE FROM users;
          `);
        } catch (error) {
            throw error;
        }
      };