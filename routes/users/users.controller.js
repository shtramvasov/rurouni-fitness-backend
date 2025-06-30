const bcrypt = require('bcrypt'); 

class UsersController {

  static async getUser(connection, { username, email }) {
    try {
      const result = await connection.query(
        `select user_id from users where username = $1 or email = $2`,
        [username, email]
      );
      
      return result.rows[0];   
    } catch (error) {
        throw error
    }
  }

  static async postUser(connection, { username, password, passwordHash, email, display_name = null }) {
    try {
      const user = await connection.query(`
        insert into users (username, password, password_raw, email, display_name, created_on_tz) values ($1, $2, $3, $4, $5, now())
        returning user_id, username, display_name, email`,
        [username, passwordHash, password, email, display_name]
      );

      return user.rows[0]
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(connection, userModel, { display_name, gender, avatar_url, old_password, new_password }) {
    try {
      const updates = [];
      const params = [userModel.user_id];
      let user = []

      if(old_password && new_password) {
        const isPasswordMatched = await bcrypt.compare(String(old_password), userModel.password);

        if(!isPasswordMatched) {
          throw new Error('Переданы неверные данные')
        }

        const passwordHash = await bcrypt.hash(new_password, 10);
        
        params.push(passwordHash)
        updates.push(`password = $${params.length}`)

        params.push(new_password)
        updates.push(`password_raw = $${params.length}`)
      }

      if(display_name !== undefined) {
        params.push(display_name)
        updates.push(`display_name = $${params.length}`)
      }

      if(gender !== undefined) {
        params.push(gender)
        updates.push(`gender = $${params.length}`)
      }

      if(avatar_url) {
        params.push(avatar_url)
        updates.push(`avatar_url = $${params.length}`)
      }

      if(updates.length) {
        updates.push('updated_on_tz = NOW()');

        user = (await connection.query(`
          update users 
          set ${updates.join(', ')} 
          where user_id = $1
          returning user_id, username, email, created_on_tz, updated_on_tz, last_login_on_tz, gender, avatar_url, display_name`, 
          params
        )).rows[0]
      }

      return user

    } catch (error) {
      throw error
    }
  }

  static async updateLastLogin(connection, { user_id, ip_address = 'dev', user_agent }) {
    try {
      // Обновляем у юзера
      await connection.query(`update users set last_login_on_tz = now() where user_id = $1`, [user_id])

      // Записываем лог о логине
      await connection.query(`insert into logins_log (user_id, ip_address, user_agent) values ($1, $2, $3)`, [user_id, ip_address, user_agent])
      
    } catch (error) {
        throw error
    }

  }

  static async getRecentLogins(connection, { user_id }) {
    try {
      const result = await connection.query('select * from logins_log where user_id = $1 order by login_id desc limit 5', [user_id])

      return result.rows
    } catch (error) {
        throw error
    }
  }

  static async generatePassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const random_password = Array.from({ length: 6 }, () => chars[ Math.floor(Math.random() * 58)]).join('');
    return random_password
  }

}

module.exports = UsersController;