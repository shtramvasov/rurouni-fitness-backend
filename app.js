const express = require('express');
const cors = require('cors');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const pg = require('pg');
const authenticate = require('./middlewares/authenticate')
const passport = require('./middlewares/passport-strategy');
const router = require('./routes/index');
const authRouter = require('./routes/auth/auth');
require('dotenv').config();

const API_PORT = process.env.API_PORT || 9000;
const app = express();

// middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
pg.types.setTypeParser(1082, value => value)

// session
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 5 * 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());


// routes
app.use('/api/auth', authRouter);
app.use('/api', authenticate, router);
// app.use('/api', router);

app.listen(API_PORT, () => {
	console.log(`Server is listering on port: ${API_PORT}`);
});