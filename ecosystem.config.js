module.exports = {
  apps: [{
    name: "rf-backend",
    script: "./app.js",
    env: {
      SESSION_SECRET: 'powerlifting',
      API_PORT: 9057,
      DB_HOST: 'localhost',
      DB_PORT: 5432,
      DB_USER: 'postgres',
      DB_PASSWORD: '5746',
      DB_NAME: 'rurouni_fitness',
      DB_MAX_CONNECTIONS: 10
    },
  }]
};