module.exports.up = async (connection) => {
        try {
          await connection.query(`
            ----users
            create table users (
              user_id 			    serial 			  primary key,
              username 			    varchar(128)	not null unique,
              password			    varchar(255)	not null,
              email				      varchar(128) 	not null unique,
              created_on_tz 		timestamptz 	default now(),
              updated_on_tz 		timestamptz,
              last_login_on_tz  timestamptz,
              gender 				    char(1),
              avatar_url 			  varchar(255)
            );

            ----exercises
            create table exercises (
              exercise_id 		  varchar(32) 	primary key,
              name 				      varchar(128)	not null,
              muscle_group		  varchar(32)		not null,
              calories_per_rep 	numeric,
              unit				      char(2)			  default 'кг'
            );
            create index idx_exercises_name ON exercises (name);
            create index idx_exercises_muscle_group ON exercises (muscle_group);

            ----workouts
            create table workouts (
              workout_id 			  serial 			  primary key,
              user_id 			    integer 		  not null references users(user_id),
              title				      varchar(128)	not null,
              created_on_tz 		timestamptz 	default now()
            );
            create index idx_workouts_user_id ON workouts (user_id);
            create index idx_workouts_title ON workouts (title);

            ----training_programs 
            create table training_programs  (
              program_id  			serial 			  primary key,
              user_id 				  integer 		  not null references users(user_id),
              name					    varchar(64)		not null,
              description				text,
              is_active				  boolean			  not null default true,
              created_on_tz 		timestamptz 	default now(),
              updated_on_tz 		timestamptz
            );

            ----workout_exercises
            create table workout_exercises (
              workout_exercise_id  	serial 			    primary key,
              workout_id 					  integer 		    not null references workouts(workout_id),
              exercise_id 				  varchar(32) 	  not null references exercises(exercise_id),
              sets						      numeric,
              reps						      numeric,
              weight						    numeric(8,2)
            );
            create index idx_workout_exercises_workout_id  	 ON workout_exercises (workout_id);
            create index idx_workout_exercises_exercise_id   ON workout_exercises (exercise_id);

            ----program_exercises 
            create table program_exercises  (
              program_exercise_id   serial 			    primary key,
              program_id  				  integer 		    not null references training_programs(program_id),
              exercise_id 				  varchar(32) 	  not null references exercises(exercise_id),
              sets						      numeric,
              reps						      numeric
            );
            create index idx_program_exercises_program_id     ON program_exercises  (program_id);
            create index idx_program_exercises_exercise_id    ON program_exercises  (exercise_id);
          `);
        } catch (error) {
            throw error;
        }
      };
      
      module.exports.down = async (connection) => {
        try {
          await connection.query(`
            drop table workout_exercises;
            drop table program_exercises;
          
            drop table exercises;
            drop table workouts;
            drop table training_programs;
            drop table users;
          `);
        } catch (error) {
            throw error;
        }
      };