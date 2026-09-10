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

        // One-time migration: move any legacy blog rows into blog_posts as published articles
        const legacyCheck = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables WHERE table_name = 'blogs'
            ) AS legacy_exists
        `);
        if (legacyCheck.rows[0].legacy_exists) {
            const legacy = await pool.query('SELECT id, title, content, created_at FROM blogs ORDER BY id');
            for (const row of legacy.rows) {
                const exists = await pool.query('SELECT 1 FROM blog_posts WHERE title = $1 LIMIT 1', [row.title]);
                if (exists.rows.length === 0) {
                    await pool.query(
                        `INSERT INTO blog_posts (title, slug, content, status, published_at, created_at, updated_at)
                         VALUES ($1, $2, $3, 'published', $4, $4, $4)`,
                        [row.title, await slugify(row.title), row.content, row.created_at]
                    );
                }
            }
        }
    } catch (err) {
        console.error('Error initializing database:', err);
    }
};

// Generate a URL-safe slug from a title
const slugify = async (title) => {
    let base = String(title)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || 'post';

    let slug = base;
    let counter = 2;
    while (true) {
        const clash = await pool.query('SELECT 1 FROM blog_posts WHERE slug = $1 LIMIT 1', [slug]);
        if (clash.rows.length === 0) return slug;
        slug = `${base}-${counter++}`;
    }
};

// Estimate reading time in whole minutes (minimum 1)
const readingTime = (content) => {
    const words = String(content || '').trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
};

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  initDb,
  slugify,
  readingTime,
};
