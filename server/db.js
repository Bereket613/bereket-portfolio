const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/portfolio',
});

// Optionally create tables if they don't exist
const initDb = async () => {
    try {
        const fs = require('fs');
        const path = require('path');
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        await pool.query(schema);
        console.log('Database initialized successfully.');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
};

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  initDb,
};
