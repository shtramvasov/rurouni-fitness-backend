const passport = require('passport');
const bcrypt = require('bcrypt'); 
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../db-connection');

passport.use(new LocalStrategy(
  async (username, password, done) => {
    await pool.query('select * from users where username = $1', [username],  async (error, result) => {
      if (error) return done(error);

      if (result.rows.length === 0) {
        return done(null, false, { message: 'Неправильный юзернейм' });
      }

      const user = result.rows[0];
      console.log(user)

      const isPasswordMatched = await bcrypt.compare(String(password), user.password);

      if (!isPasswordMatched) {
        return done(null, false, { message: 'Неправильный пароль' });
      }

      return done(null, user);
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async(user_id, done) => {
  try {
    let user = (await pool.query('select * from users where user_id = $1', [user_id])).rows[0];   
    if(user) return done(null, user);

    return done(null, false);
  } catch(err) {
    console.error(err);
    throw err;
  }
});

module.exports = passport;

