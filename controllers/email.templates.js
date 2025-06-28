const EMAIL_TEMPLATE = {
  welcome: {
    subject: 'Добро пожаловать!',
    text: (user) => `
      Отличных тренировок, ${user.display_name || user.username}!
      
      Логин: ${user.username}
      Пароль: ${user.password_raw}
      
      С уважением,
      Команда Rurouni Fitness
    `,
    html: (user) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2d3748;">Добро пожаловать в Rurouni Fitness!</h1>
        <p>Отличных тренировок, ${user.display_name || user.username}!</p>
        
        <div style="background: #f7fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>Логин:</strong> ${user.username}</p>
          <p><strong>Пароль:</strong> ${user.password_raw}</p>
        </div>
        
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
          <p>С уважением,<br>Команда Rurouni Fitness</p>
        </div>
      </div>
    `
  },
  changePassword: {
    subject: 'Ваш пароль был изменен',
    text: (user) => `
      Уважаемый ${user.display_name || user.username},
      
      Ваш пароль для Rurouni Fitness был успешно изменен.

      Ваш новый пароль: ${user.password_raw}
      
      Если это были не вы, пожалуйста, немедленно свяжитесь с поддержкой.
      
      С уважением,
      Команда Rurouni Fitness
    `,
    html: (user) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2d3748;">Пароль изменен</h1>
        <p>Уважаемый ${user.display_name || user.username},</p>
        <p>Ваш пароль для Rurouni Fitness был успешно изменен.</p>

        <p>Ваш новый пароль:<strong>${user.password_raw}</strong> </p>
        
        <div style="background: #f7fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p>Если это были не вы, пожалуйста, немедленно свяжитесь с поддержкой.</p>
        </div>
        
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
          <p>С уважением,<br>Команда Rurouni Fitness</p>
        </div>
      </div>
    `
  },
  resetPassword: {
    subject: 'Восстановление пароля в Rurouni Fitness',
    text: (user) => `
      Уважаемый ${user.display_name || user.username},
      
      Мы получили запрос на восстановление вашего пароля в Rurouni Fitness.
      
      Ваш новый пароль: ${user.password_raw}
      
      Пожалуйста, войдите в систему и измените этот пароль в настройках профиля.
      
      Если вы не запрашивали сброс пароля, пожалуйста, немедленно свяжитесь с поддержкой.
      
      С уважением,
      Команда Rurouni Fitness
    `,
    html: (user) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2d3748;">Восстановление пароля</h1>
        <p>Уважаемый ${user.display_name || user.username},</p>
        <p>Мы получили запрос на восстановление вашего пароля в Rurouni Fitness.</p>
        
        <div style="background: #f7fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3 style="margin-top: 0; color: #2d3748;">Ваш новый пароль:</h3>
          <div style="font-size: 24px; font-weight: bold; text-align: center; padding: 10px; background: #ffffff; border-radius: 4px;">
            ${user.password_raw}
          </div>
          <p style="margin-bottom: 0; font-size: 14px; color: #718096;">Пожалуйста, измените этот пароль после входа в систему.</p>
        </div>
        
        <div style="background: #fff5f5; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #fc8181;">
          <p style="margin: 0; color: #e53e3e;">Если вы не запрашивали сброс пароля, немедленно свяжитесь с нашей поддержкой.</p>
        </div>
        
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
          <p>С уважением,<br>Команда Rurouni Fitness</p>
        </div>
      </div>
    `
  }
}

module.exports = EMAIL_TEMPLATE