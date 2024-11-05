const fs = require('fs');
const path = require('path');
const pool = require('./db-connection');

async function initialize() {
  console.clear();

  const { default: inquirer } = await import('inquirer');

  const migrationsFilePath = path.join(__dirname, 'migrations.json');
  const migrationsFolder = path.join(__dirname, 'migrations');

  // Создаем папку для миграций, если не существует
  if (!fs.existsSync(migrationsFolder)) {
    fs.mkdirSync(migrationsFolder);
  }
  
  // Создаем файл для миграций, если ранее не был создан
  if (!fs.existsSync(migrationsFilePath)) {
    fs.writeFileSync(migrationsFilePath, '[]', 'utf-8');
  }

  const appliedMigrations = JSON.parse(fs.readFileSync(migrationsFilePath, 'utf-8'));
  const migrationFiles = fs.readdirSync(path.join(__dirname, 'migrations'));


  // Убираем из списка уже примененные миграции
  const pendingMigrations = migrationFiles.filter((file) => {
    return !appliedMigrations.includes(file.replace('.js', ''))
  });

  if (!pendingMigrations.length) {
    console.log('Все миграции применены')
  }
  
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Выберите действие:',
      choices: ['Создать миграцию', 'Применить миграцию', 'Отменить миграцию'],
    },
  ]);

  if (action === 'Создать миграцию') {
    const { migrationName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'migrationName',
        message: 'Введине название миграции:'
      }
    ]);

    const timestamp = new Date().getTime()
    const fileName = `${timestamp}_${migrationName}.js`

    const template = 
      `module.exports.up = async (connection) => {
        try {
          await connection.query(\`
          -- Поднять миграцию
          \`);
        } catch (error) {
            throw error;
        }
      };
      
      module.exports.down = async (connection) => {
        try {
          await connection.query(\`
          -- Отменить миграцию
          \`);
        } catch (error) {
            throw error;
        }
      };`;

      const migrationPath = path.join(__dirname, 'migrations', fileName);
      fs.writeFileSync(migrationPath, template);

      console.log(`Создана миграция: ${migrationName}`);   
  };

  if (action === 'Применить миграцию') {
    const { selectedMigrations } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selectedMigrations',
        message: 'Выберите миграции для применения:',
        choices: pendingMigrations
      }
    ]);

    for (let migration of selectedMigrations) {
      const migrationName = migration.replace('.js', '');
      const migrationModule = require(path.join(__dirname, 'migrations', migration));

      await migrationModule.up(pool);

      // Поставить отметку о примененной миграции
      appliedMigrations.push(migrationName);
      fs.writeFileSync(migrationsFilePath, JSON.stringify(appliedMigrations, null, 2));

      console.log(`Применена миграция: ${migrationName}`);
    }
  };

  if (action === 'Отменить миграцию') {

    // Проверяем наличие примененных миграций
    if(!appliedMigrations.length) {
      console.log('Нет миграций для отмены');
      return;
    }

    const { selectedMigrations } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selectedMigrations',
        message: 'Выберите миграции для отмены:',
        choices: appliedMigrations
      }
    ]);

    for (let migration of selectedMigrations) {
      const migrationName = migration.replace('.js', '');
      const migrationModule = require(path.join(__dirname, 'migrations', migration));

      await migrationModule.down(pool);

      // Убрать отметку о применной миграции
      appliedMigrations.splice(appliedMigrations.indexOf(migrationName), 1);
      fs.writeFileSync(migrationsFilePath, JSON.stringify(appliedMigrations, null, 2));

      console.log(`Отменена миграция: ${migrationName}`);
    }
  };
}

initialize();
