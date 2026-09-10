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
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Project not found' });
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- EXPERIENCE ENDPOINTS ---
app.get('/api/experiences', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM experiences ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/experiences/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM experiences WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Experience not found' });
        res.json({ message: 'Experience deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/messages', authenticateToken, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM messages ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/messages/:id/read', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('UPDATE messages SET is_read = TRUE WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Message not found' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/messages/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM messages WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Message not found' });
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- BLOGS ENDPOINTS ---
app.get('/api/blogs', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM blogs ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/blogs', authenticateToken, async (req, res) => {
    try {
        const { title, content } = req.body;
        const result = await db.query(
            'INSERT INTO blogs (title, content) VALUES ($1, $2) RETURNING *',
            [title, content]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/blogs/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const result = await db.query(
            'UPDATE blogs SET title=$1, content=$2 WHERE id=$3 RETURNING *',
            [title, content, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Blog not found' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/blogs/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM blogs WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Blog not found' });
        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/blogs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM blogs WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Blog not found' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- PROFILE ENDPOINTS ---
app.get('/api/profile', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM profile LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (error) {
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
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
        const blogsCount = await db.query('SELECT COUNT(*) FROM blogs');
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
            totalVisitors: parseInt(visitorsCount.rows[0].count),
            visitsLast7Days: visitsSeries.rows,
            messagesLast7Days: messagesSeries.rows,
            projectsByCategory: byCategory.rows
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
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
