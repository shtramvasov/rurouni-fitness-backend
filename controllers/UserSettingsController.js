
class UserSettingsController {

  static async createUserSettings(connection, { user_id }) {
    try {

      await connection.query(`insert into user_settings (user_id) values ($1)`, [user_id])
      
    } catch (error) {
        throw error;
    }
  }

  static async updateUserSettings(connection, userModel, { news_updates, personal_statistics, workout_reminders, security_alerts }) {
    try {
      const updates = [];
      const params = [userModel.user_id];

      if(news_updates !== undefined) {
        params.push(news_updates)
        updates.push(`email_news_updates = $${params.length}`)
      }

      if(personal_statistics !== undefined) {
        params.push(personal_statistics)
        updates.push(`email_personal_statistics = $${params.length}`)
      }

      if(workout_reminders !== undefined) {
        params.push(workout_reminders)
        updates.push(`telegram_workout_reminders = $${params.length}`)
      }

      if(security_alerts !== undefined) {
        params.push(security_alerts)
        updates.push(`telegram_security_alerts = $${params.length}`)
      }

      if(updates.length) {
        await connection.query(` update user_settings set ${updates.join(', ')} where user_id = $1`, params)
      }
      
    } catch (error) {
        throw error;
    }
  }
}

module.exports = UserSettingsController;