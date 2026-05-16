const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on("error", () => {
  // Intentionally empty: avoid crashing on idle client errors
});

function query(text, params) {
  return pool.query(text, params);
}

module.exports = { pool, query };
