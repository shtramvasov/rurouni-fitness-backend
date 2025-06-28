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

  static async updateUser(connection, { user_id, display_name, gender }) {
    try {
      const updates = [];
      const params = [user_id];
      let user = []

      if(display_name !== undefined) {
        params.push(display_name)
        updates.push(`display_name = $${params.length}`)
      }

      if(gender) {
        params.push(gender)
        updates.push(`gender = $${params.length}`)
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

}

module.exports = UsersController;