const { Pool } = require('pg');
require('dotenv').config();

class pool extends Pool {
  constructor() {
    super({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      max: process.env.DB_MAX_CONNECTIONS
    });
  }
}

module.exports = new pool();