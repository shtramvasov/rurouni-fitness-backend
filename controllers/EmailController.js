
class EmailController {

  static async createLog(connection, { user_id, email, subject, payload_text, payload_html }) {
    try {

      await connection.query(`
        insert into email_log (user_id, email, subject, payload_text, payload_html) values ($1, $2, $3, $4, $5)`,
        [user_id, email, subject, payload_text, payload_html]
      )
      
    } catch (error) {
        throw error;
    }
  }
}

module.exports = EmailController;