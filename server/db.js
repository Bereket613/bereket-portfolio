const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost') && !process.env.DATABASE_URL.includes('127.0.0.1');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/portfolio',
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

// Optionally create tables if they don't exist
const initDb = async () => {
    try {
        const fs = require('fs');
        const path = require('path');
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        await pool.query(schema);

        // Seed the skills table with default content on first run (skipped when data exists,
        // so admin edits in the dashboard are never overwritten)
        const seedPath = path.join(__dirname, 'seed-skills.json');
        if (fs.existsSync(seedPath)) {
            const skills = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
            const count = await pool.query('SELECT COUNT(*) FROM skills');
            if (parseInt(count.rows[0].count, 10) === 0 && Array.isArray(skills)) {
                for (const [groupIndex, group] of skills.entries()) {
                    for (const [skillIndex, name] of group.skills.entries()) {
                        await pool.query(
                            'INSERT INTO skills (category, name, description, sort_order) VALUES ($1, $2, $3, $4)',
                            [group.category, name, group.description, groupIndex * 100 + skillIndex]
                        );
                    }
                }
                console.log('Skills table seeded with default content.');
            }
        }

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
