const { Pool } = require('pg');

const pool = new Pool();
pool.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');
  })
  .catch((err) => {
    console.error('Error connecting to PostgreSQL database', err);
  });
module.exports = {
  query: (text, params) => pool.query(text, params),
};
