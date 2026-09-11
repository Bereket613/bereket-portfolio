// server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here';

// Initialize DB schema
db.initDb();

// --- FILE UPLOADS (multer) ---
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        cb(null, `${Date.now()}-${safeName}`);
    }
});

const imageFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files (jpeg, png, webp, gif, svg) are allowed'));
};

const pdfFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'));
};

const uploadImage = multer({ storage, fileFilter: imageFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadResume = multer({ storage, fileFilter: pdfFilter, limits: { fileSize: 10 * 1024 * 1024 } });

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// CORS Configuration
const allowedOrigins = [
    'http://localhost:3000',
    'https://Bereket613.github.io',
    'https://bereket613.github.io',
    ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(o => o.trim()) : [])
];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// --- MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ message: 'Access denied' });
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

// --- AUTH ROUTES ---
app.post('/api/admin/setup', async (req, res) => {
    // Only use this once to create the initial admin user!
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Prevent anyone from creating additional admins once one exists
        const existingAdmins = await db.query('SELECT COUNT(*) FROM admins');
        if (parseInt(existingAdmins.rows[0].count, 10) > 0) {
            return res.status(403).json({ message: 'Setup already completed. Admin user exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO admins (username, password_hash) VALUES ($1, $2)', [username, hashedPassword]);
        res.status(201).json({ message: 'Admin user created successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await db.query('SELECT * FROM admins WHERE username = $1', [username]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const admin = result.rows[0];
        const isMatch = await bcrypt.compare(password, admin.password_hash);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, username: admin.username });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- PROJECTS ENDPOINTS ---
app.get('/api/projects', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ message: error.message || 'Database error' });
    }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
    try {
        const { title, description, image_url, tech_stack, live_demo_url, github_url, category } = req.body;
        const result = await db.query(
            'INSERT INTO projects (title, description, image_url, tech_stack, live_demo_url, github_url, category) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [title, description, image_url, tech_stack, live_demo_url, github_url, category]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ message: error.message || 'Database error' });
    }
});

app.put('/api/projects/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, image_url, tech_stack, live_demo_url, github_url, category } = req.body;
        const result = await db.query(
            'UPDATE projects SET title=$1, description=$2, image_url=$3, tech_stack=$4, live_demo_url=$5, github_url=$6, category=$7 WHERE id=$8 RETURNING *',
            [title, description, image_url, tech_stack, live_demo_url, github_url, category, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Project not found' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ message: error.message || 'Database error' });
    }
});

app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Project not found' });
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ message: error.message || 'Database error' });
    }
});

// --- EXPERIENCE ENDPOINTS ---
app.get('/api/experiences', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM experiences ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ message: error.message || 'Database error' });
    }
});

app.post('/api/experiences', authenticateToken, async (req, res) => {
    try {
        const { role, organization, duration, description, key_achievements, tech_stack, logo_url } = req.body;
        const result = await db.query(
            'INSERT INTO experiences (role, organization, duration, description, key_achievements, tech_stack, logo_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [role, organization, duration, description, key_achievements, tech_stack, logo_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ message: error.message || 'Database error' });
    }
});

app.put('/api/experiences/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { role, organization, duration, description, key_achievements, tech_stack, logo_url } = req.body;
        const result = await db.query(
            'UPDATE experiences SET role=$1, organization=$2, duration=$3, description=$4, key_achievements=$5, tech_stack=$6, logo_url=$7 WHERE id=$8 RETURNING *',
            [role, organization, duration, description, key_achievements, tech_stack, logo_url, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Experience not found' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ message: error.message || 'Database error' });
    }
});

app.delete('/api/experiences/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM experiences WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Experience not found' });
        res.json({ message: 'Experience deleted successfully' });
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ message: error.message || 'Database error' });
    }
});

// --- MESSAGES ENDPOINTS ---
app.post('/api/messages', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        const result = await db.query(
            'INSERT INTO messages (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING id, name, email, created_at',
            [name, email, subject, message]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ message: error.message || 'Database error' });
    }
});

app.get('/api/messages', authenticateToken, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM messages ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ message: error.message || 'Database error' });
    }
});

app.put('/api/messages/:id/read', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('UPDATE messages SET is_read = TRUE WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Message not found' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ message: error.message || 'Database error' });
    }
});

app.delete('/api/messages/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM messages WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Message not found' });
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ message: error.message || 'Database error' });
    }
});


// --- PROFILE ENDPOINTS ---
app.get('/api/profile', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM profile LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ message: error.message || 'Database error' });
    }
});

app.put('/api/profile', authenticateToken, async (req, res) => {
    try {
        const { name, title, about, logo_url, email, github, linkedin, location, resume_url } = req.body;

        const check = await db.query('SELECT * FROM profile LIMIT 1');
        let result;
        if (check.rows.length === 0) {
            result = await db.query(
                'INSERT INTO profile (name, title, about, logo_url, email, github, linkedin, location, resume_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
                [name, title, about, logo_url, email, github, linkedin, location, resume_url]
            );
        } else {
            result = await db.query(
                'UPDATE profile SET name=$1, title=$2, about=$3, logo_url=$4, email=$5, github=$6, linkedin=$7, location=$8, resume_url=$9 WHERE id=$10 RETURNING *',
                [name, title, about, logo_url, email, github, linkedin, location, resume_url, check.rows[0].id]
            );
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ message: error.message || 'Database error' });
    }
});

// --- FILE UPLOAD ENDPOINTS ---
app.post('/api/upload/image', authenticateToken, uploadImage.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

app.post('/api/upload/resume', authenticateToken, uploadResume.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        const resumeUrl = `/uploads/${req.file.filename}`;
        const check = await db.query('SELECT id FROM profile LIMIT 1');
        if (check.rows.length === 0) {
            await db.query('INSERT INTO profile (resume_url) VALUES ($1)', [resumeUrl]);
        } else {
            await db.query('UPDATE profile SET resume_url = $1 WHERE id = $2', [resumeUrl, check.rows[0].id]);
        }
        res.status(201).json({ url: resumeUrl });
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ message: error.message || 'Database error' });
    }
});

// --- VISITOR TRACKING (public, fire-and-forget) ---
app.post('/api/track', async (req, res) => {
    try {
        const page = typeof req.body.page === 'string' ? req.body.page.slice(0, 255) : '/';
        const userAgent = typeof req.headers['user-agent'] === 'string' ? req.headers['user-agent'].slice(0, 512) : '';
        await db.query('INSERT INTO visits (page, user_agent) VALUES ($1, $2)', [page, userAgent]);
    } catch (error) {
        // Never surface tracking failures to the client
    }
    res.status(204).end();
});

// --- ANALYTICS ---
app.get('/api/analytics', authenticateToken, async (req, res) => {
    try {
        const projectsCount = await db.query('SELECT COUNT(*) FROM projects');
        const messagesCount = await db.query('SELECT COUNT(*) FROM messages');
        const experiencesCount = await db.query('SELECT COUNT(*) FROM experiences');
        const unreadMessagesCount = await db.query('SELECT COUNT(*) FROM messages WHERE is_read = FALSE');
        const blogsCount = await db.query('SELECT COUNT(*) FROM blog_posts');
        const publishedPostsCount = await db.query("SELECT COUNT(*) FROM blog_posts WHERE status = 'published'");
        const draftPostsCount = await db.query("SELECT COUNT(*) FROM blog_posts WHERE status = 'draft'");
        const visitorsCount = await db.query('SELECT COUNT(*) FROM visits');

        // Last 7 days activity series (fills missing days with zeros)
        const visitsSeries = await db.query(`
            SELECT to_char(d::date, 'YYYY-MM-DD') AS date, COUNT(v.id)::int AS visits
            FROM generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, INTERVAL '1 day') d
            LEFT JOIN visits v ON v.visited_at::date = d::date
            GROUP BY d ORDER BY d
        `);
        const messagesSeries = await db.query(`
            SELECT to_char(d::date, 'YYYY-MM-DD') AS date, COUNT(m.id)::int AS messages
            FROM generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, INTERVAL '1 day') d
            LEFT JOIN messages m ON m.created_at::date = d::date
            GROUP BY d ORDER BY d
        `);
        const byCategory = await db.query(`
            SELECT COALESCE(NULLIF(category, ''), 'Uncategorized') AS category, COUNT(*)::int AS count
            FROM projects GROUP BY category ORDER BY count DESC
        `);

        res.json({
            totalProjects: parseInt(projectsCount.rows[0].count),
            totalMessages: parseInt(messagesCount.rows[0].count),
            totalExperiences: parseInt(experiencesCount.rows[0].count),
            unreadMessages: parseInt(unreadMessagesCount.rows[0].count),
            totalBlogs: parseInt(blogsCount.rows[0].count),
            publishedPosts: parseInt(publishedPostsCount.rows[0].count),
            draftPosts: parseInt(draftPostsCount.rows[0].count),
            totalVisitors: parseInt(visitorsCount.rows[0].count),
            visitsLast7Days: visitsSeries.rows,
            messagesLast7Days: messagesSeries.rows,
            projectsByCategory: byCategory.rows
        });
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ message: error.message || 'Database error' });
    }
});

// --- SKILLS ENDPOINTS ---
app.get('/api/skills', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM skills ORDER BY sort_order, id');
        res.json(result.rows);
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ message: error.message || 'Database error' });
    }
});

app.post('/api/skills', authenticateToken, async (req, res) => {
    try {
        const { category, name, description } = req.body;
        if (!category || !name) return res.status(400).json({ message: 'Category and name are required' });
        const result = await db.query(
            'INSERT INTO skills (category, name, description) VALUES ($1, $2, $3) RETURNING *',
            [category, name, description || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ message: error.message || 'Database error' });
    }
});

app.put('/api/skills/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { category, name, description } = req.body;
        if (!category || !name) return res.status(400).json({ message: 'Category and name are required' });
        const result = await db.query(
            'UPDATE skills SET category=$1, name=$2, description=$3 WHERE id=$4 RETURNING *',
            [category, name, description || null, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Skill not found' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ message: error.message || 'Database error' });
    }
});

app.delete('/api/skills/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM skills WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Skill not found' });
        res.json({ message: 'Skill deleted successfully' });
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ message: error.message || 'Database error' });
    }
});

// --- BLOG / ENGINEERING JOURNAL ENDPOINTS ---

// Public: paginated, searchable list of published posts
app.get('/api/blog', async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
        const offset = (page - 1) * limit;
        const search = (req.query.search || '').trim().slice(0, 100);
        const category = (req.query.category || '').trim().slice(0, 100);

        let where = "WHERE status = 'published'";
        const params = [];
        if (search) {
            params.push(`%${search}%`);
            where += ` AND (title ILIKE $${params.length} OR excerpt ILIKE $${params.length} OR content ILIKE $${params.length} OR category ILIKE $${params.length})`;
        }
        if (category) {
            params.push(category);
            where += ` AND category = $${params.length}`;
        }

        const count = await db.query(`SELECT COUNT(*) FROM blog_posts ${where}`, params);
        params.push(limit, offset);
        const posts = await db.query(
            `SELECT id, title, slug, excerpt, cover_image_url, category, tags, reading_time, published_at, updated_at
             FROM blog_posts ${where}
             ORDER BY published_at DESC NULLS LAST, created_at DESC
             LIMIT $${params.length - 1} OFFSET $${params.length}`,
            params
        );

        res.json({
            posts: posts.rows,
            total: parseInt(count.rows[0].count),
            page,
            pages: Math.max(1, Math.ceil(parseInt(count.rows[0].count) / limit))
        });
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ message: error.message || 'Database error' });
    }
});

// Public: distinct categories of published posts (for filtering UI)
app.get('/api/blog-categories', async (req, res) => {
    try {
        const result = await db.query(
            "SELECT DISTINCT category FROM blog_posts WHERE status = 'published' AND category IS NOT NULL AND category <> '' ORDER BY category"
        );
        res.json(result.rows.map(r => r.category));
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ message: error.message || 'Database error' });
    }
});

// Public: single published post by slug
app.get('/api/blog/:slug', async (req, res) => {
    try {
        const result = await db.query(
            "SELECT id, title, slug, excerpt, content, cover_image_url, category, tags, reading_time, published_at, updated_at FROM blog_posts WHERE slug = $1 AND status = 'published'",
            [req.params.slug]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Article not found' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ message: error.message || 'Database error' });
    }
});

// Public: adjacent published posts for prev/next navigation
app.get('/api/blog/:slug/adjacent', async (req, res) => {
    try {
        const current = await db.query("SELECT id, published_at FROM blog_posts WHERE slug = $1 AND status = 'published'", [req.params.slug]);
        if (current.rows.length === 0) return res.status(404).json({ message: 'Article not found' });
        const { id, published_at } = current.rows[0];
        const next = await db.query(
            "SELECT title, slug FROM blog_posts WHERE status = 'published' AND id <> $1 AND COALESCE(published_at, created_at) > COALESCE($2::timestamp, created_at) ORDER BY COALESCE(published_at, created_at) ASC LIMIT 1",
            [id, published_at]
        );
        const prev = await db.query(
            "SELECT title, slug FROM blog_posts WHERE status = 'published' AND id <> $1 AND COALESCE(published_at, created_at) < COALESCE($2::timestamp, created_at) ORDER BY COALESCE(published_at, created_at) DESC LIMIT 1",
            [id, published_at]
        );
        res.json({ prev: prev.rows[0] || null, next: next.rows[0] || null });
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ message: error.message || 'Database error' });
    }
});

// Admin: list all posts (including drafts)
app.get('/api/admin/blog', authenticateToken, async (req, res) => {
    try {
        const status = req.query.status;
        let where = '';
        const params = [];
        if (status && ['draft', 'published', 'archived'].includes(status)) {
            params.push(status);
            where = 'WHERE status = $1';
        }
        const result = await db.query(
            `SELECT id, title, slug, excerpt, content, cover_image_url, category, tags, status, reading_time, published_at, updated_at
             FROM blog_posts ${where} ORDER BY updated_at DESC`,
            params
        );
        res.json(result.rows);
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ message: error.message || 'Database error' });
    }
});

// Admin: create post
app.post('/api/blog', authenticateToken, async (req, res) => {
    try {
        const { title, excerpt, content, cover_image_url, category, tags, status, published_at } = req.body;
        if (!title || !content || String(title).length > 255) {
            return res.status(400).json({ message: 'Title (max 255 chars) and content are required' });
        }
        const validStatus = ['draft', 'published'].includes(status) ? status : 'draft';
        const slug = await db.slugify(title);
        const reading = db.readingTime(content);
        const tagArray = Array.isArray(tags) ? tags.map(t => String(t).slice(0, 50)).slice(0, 20) : [];
        const result = await db.query(
            `INSERT INTO blog_posts (title, slug, excerpt, content, cover_image_url, category, tags, status, reading_time, published_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [
                title,
                slug,
                (excerpt || '').slice(0, 500) || null,
                content,
                cover_image_url || null,
                (category || '').slice(0, 100) || null,
                tagArray,
                validStatus,
                reading,
                validStatus === 'published' ? (published_at || new Date()) : null
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ message: error.message || 'Database error' });
    }
});

// Admin: update post
app.put('/api/blog/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, excerpt, content, cover_image_url, category, tags, status } = req.body;
        if (!title || !content) return res.status(400).json({ message: 'Title and content are required' });

        const existing = await db.query('SELECT * FROM blog_posts WHERE id = $1', [id]);
        if (existing.rows.length === 0) return res.status(404).json({ message: 'Post not found' });
        const old = existing.rows[0];

        const validStatus = ['draft', 'published', 'archived'].includes(status) ? status : old.status;
        // Regenerate slug only when the title changes
        const slug = title !== old.title ? await db.slugify(title) : old.slug;
        const reading = db.readingTime(content);
        // Fall back to existing values for fields not provided (prevents partial updates wiping data)
        const tagArray = Array.isArray(tags) ? tags.map(t => String(t).slice(0, 50)).slice(0, 20) : old.tags || [];
        const finalCategory = category !== undefined ? ((category || '').slice(0, 100) || null) : old.category;
        const finalExcerpt = excerpt !== undefined ? ((excerpt || '').slice(0, 500) || null) : old.excerpt;
        const finalCover = cover_image_url !== undefined ? (cover_image_url || null) : old.cover_image_url;
        const publishedAt = validStatus === 'published' ? (old.published_at || new Date()) : old.published_at;

        const result = await db.query(
            `UPDATE blog_posts SET title=$1, slug=$2, excerpt=$3, content=$4, cover_image_url=$5, category=$6, tags=$7, status=$8, reading_time=$9, published_at=$10, updated_at=NOW()
             WHERE id=$11 RETURNING *`,
            [title, slug, finalExcerpt, content, finalCover, finalCategory, tagArray, validStatus, reading, publishedAt, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ message: error.message || 'Database error' });
    }
});

// Admin: delete post
app.delete('/api/blog/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM blog_posts WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Post not found' });
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ message: error.message || 'Database error' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Silence Chrome Devtools warnings
app.options('/.well-known/appspecific/com.chrome.devtools.json', cors());
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(204).end();
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔗 CORS configured for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});
