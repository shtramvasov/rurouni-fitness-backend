module.exports.up = async (connection) => {
        try {
          await connection.query(`
          INSERT INTO exercises (exercise_id, name, muscle_group, calories_per_rep, unit)
          VALUES
            ('calf-raises', 'Икры', 'ноги', 1, 'кг'),
            ('cable-chest-fly', 'Разводка на грудь с кабелем', 'грудь', 1, 'кг'),
            ('bicep-barbell', 'Бицепс со штангой', 'бицепс', 1, 'кг'),
            ('shoulder-press-dumbbell', 'Армейский жим с гантелями', 'плечи', 1, 'кг'),
            ('lateral-raises-dumbbell', 'Разводка на плечи с гантелями', 'плечи', 1, 'кг'),
            ('shrugs-barbell', 'Шраги со штангой', 'спина', 2, 'кг'),
            ('shrugs-dumbbell', 'Шраги с гантелями', 'спина', 2, 'кг'),
            ('lateral-raises-cable', 'Разведение рук с кабелем одной рукой', 'плечи', 2, 'кг'),
            ('machine-chest-fly', 'Разводка на грудь на тренажере', 'грудь', 2, 'кг'),
            ('lat-pulldown', 'Тяга к груди на тренажере', 'спина', 3, 'кг'),
            ('incline-bench', 'Жим в наклоне', 'грудь', 3, 'кг'),
            ('military-press', 'Армейский жим', 'плечи', 2, 'кг'),
            ('leg-press', 'Жим ногами', 'ноги', 3, 'кг'),
            ('tricep-dumbbell', 'Трицепс с гантелей', 'трицепс', 2, 'кг'),
            ('bicep-dumbbell', 'Бицепс с гантелями', 'бицепс', 3, 'кг'),
            ('pulldown', 'Тяга верхнего блока', 'спина', 3, 'кг'),
            ('front-squat', 'Фронтальный присед', 'ноги', 3, 'кг'),
            ('leg-extension', 'Разгибания ног', 'ноги', 1, 'кг'),
            ('close-grip-bench', 'Жим узким хватом', 'грудь', 3, 'кг'),
            ('french-press', 'Французский жим', 'трицепс', 2, 'кг'),
            ('tricep-cable', 'Трицепс с кабелем', 'трицепс', 2, 'кг');
          `);
        } catch (error) {
            throw error;
        }
      };
      
      module.exports.down = async (connection) => {
        try {
          await connection.query(`
          DELETE FROM exercises WHERE exercise_id IN (
            'calf-raises', 'cable-chest-fly', 'bicep-barbell', 'shoulder-press-dumbbell', 
            'lateral-raises-dumbbell', 'shrugs-barbell', 'shrugs-dumbbell', 'lateral-raises-cable', 'machine-chest-fly', 
            'lat-pulldown', 'incline-bench', 'military-press', 'leg-press', 'tricep-dumbbell', 
            'bicep-dumbbell', 'pulldown', 'front-squat', 'leg-extension', 'close-grip-bench', 
            'french-press', 'tricep-cable');
          `);
        } catch (error) {
            throw error;
        }
      };