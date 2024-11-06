module.exports.up = async (connection) => {
        try {
          await connection.query(`
            alter table users add column display_name varchar(255);
            update users set display_name = 'Админ' where username = 'dev';
          `);
        } catch (error) {
            throw error;
        }
      };
      
      module.exports.down = async (connection) => {
        try {
          await connection.query(`
            alter table users drop column display_name;
          `);
        } catch (error) {
            throw error;
        }
      };