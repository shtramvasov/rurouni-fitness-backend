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
        returning user_id, username, display_name`,
        [username, passwordHash, password, email, display_name]
      );

      return user.rows[0]
    } catch (error) {
      throw error;
    }
  }

}

module.exports = UsersController;