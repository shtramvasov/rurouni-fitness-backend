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

  static async postUser(connection, { username, password, email }) {
    try {
      const user = await connection.query(`
        insert into users (username, password, email, created_on_tz) values ($1, $2, $3, now())
        returning user_id, username`,
        [username, password, email]
      );

      return user.rows[0]
    } catch (error) {
      throw error;
    }
  }

}

module.exports = UsersController;