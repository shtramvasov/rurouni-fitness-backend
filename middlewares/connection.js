const pool = require('../db-connection');

const connection = (func) => async (req, res, next) => {
  try {
    res.locals.pg = await pool.connect();

    await func(req, res);
  } catch (error) {
      console.error(error);
      next(error);
  } finally {
    res.locals.pg && res.locals.pg.release();
  }
}

const transaction = (func) => async (req, res, next) => {
  try {
    res.locals.pg = await pool.connect();
    await res.locals.pg.query('begin')

    await func(req, res);
    await res.locals.pg.query('commit');
  } catch (error) {
      res.locals.pg && await res.locals.pg.query('rollback');
      console.error(error);
      next(error);
  } finally {
      res.locals.pg && res.locals.pg.release();
  }
}

module.exports = { connection, transaction };