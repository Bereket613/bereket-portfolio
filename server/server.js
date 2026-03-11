// server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 5000;
const GIST_ID = process.env.GIST_ID;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GIST_FILENAME = process.env.GIST_FILENAME;

// --- INITIAL CONFIGURATION & CHECKS ---
if (!GIST_ID || !GITHUB_TOKEN || !GIST_FILENAME) {
    console.error('CRITICAL ERROR: GIST_ID, GITHUB_TOKEN, and GIST_FILENAME must be set in your .env file.');
    process.exit(1);
}

// CORS Configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Helper for GitHub API Headers
const githubHeaders = {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Portfolio-App-Server'
};

// --- GITHUB GIST API FUNCTIONS ---

async function getProjectsFromGist() {
    try {
        const response = await axios.get(`https://api.github.com/gists/${GIST_ID}`, {
            headers: githubHeaders,
            timeout: 10000
        });

        const files = response.data.files;
        if (!files || !files[GIST_FILENAME]) {
            throw new Error(`Gist file "${GIST_FILENAME}" not found in Gist ${GIST_ID}.`);
        }

        const content = files[GIST_FILENAME].content;
        try {
            return JSON.parse(content);
        } catch (parseError) {
            throw new Error('Invalid JSON format in Gist file.');
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error('GitHub API Get Error:', errorMessage);
        throw new Error(`GitHub API Error: ${errorMessage}`);
    }
}

async function updateGist(projects) {
    try {
        await axios.patch(
            `https://api.github.com/gists/${GIST_ID}`,
            {
                files: {
                    [GIST_FILENAME]: {
                        content: JSON.stringify(projects, null, 2)
                    }
                },
                description: `Last updated by Portfolio App: ${new Date().toISOString()}`
            },
            {
                headers: githubHeaders,
                timeout: 10000
            }
        );
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error('GitHub API Update Error:', errorMessage);
        throw new Error(`Failed to update Gist: ${errorMessage}`);
    }
}

// --- API ENDPOINTS ---

app.get('/api/projects', async (req, res) => {
    try {
        const projects = await getProjectsFromGist();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/projects', async (req, res) => {
    try {
        const { title, description, link, category } = req.body;
        if (!title || !link) {
            return res.status(400).json({ message: 'Title and Link are required.' });
        }

        const projects = await getProjectsFromGist();

        const newProject = {
            id: Date.now().toString(),
            title,
            description: description || '',
            link,
            category: category || 'General',
            createdAt: new Date().toISOString()
        };

        const updatedProjects = [...projects, newProject];
        await updateGist(updatedProjects);
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const projects = await getProjectsFromGist();
        const updatedProjects = projects.filter(project => project.id !== id);

        if (updatedProjects.length === projects.length) {
            return res.status(404).json({ message: `Project with id ${id} not found.` });
        }

        await updateGist(updatedProjects);
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- SIMPLE BOT LOGIC ---
app.post('/api/chat', (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

        const lowerMsg = message.toLowerCase();
        let reply = "I'm not sure how to answer that yet! Try asking me about Bereket's skills, projects, or experience.";

        if (lowerMsg.includes('skill') || lowerMsg.includes('tech') || lowerMsg.includes('tool')) {
            reply = "Bereket's main skills include Python, JavaScript, React, Pandas, NumPy, Scikit-learn, and beginner TensorFlow.";
        } else if (lowerMsg.includes('project') || lowerMsg.includes('portfolio') || lowerMsg.includes('build')) {
            reply = "Bereket has built an AI Chatbot, Book Recommendation System, Stock Price Trend Visualizer, and more! Filter his portfolio above to see them.";
        } else if (lowerMsg.includes('experience') || lowerMsg.includes('job') || lowerMsg.includes('work')) {
            reply = "Bereket is an aspiring Data Scientist currently studying at Debre Berhan University in Ethiopia, focusing on Machine Learning and Data Analysis.";
        } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
            reply = "Hello! How can I help you learn more about Bereket today?";
        } else if (lowerMsg.includes('contact') || lowerMsg.includes('hire') || lowerMsg.includes('reach')) {
            reply = "You can reach Bereket using the Contact form on this site, or via his LinkedIn and GitHub links in the footer!";
        }

        // Simulate slight delay for realism
        setTimeout(() => {
            res.json({ reply });
        }, 1000);

    } catch (error) {
        console.error("Chat API error:", error);
        res.status(500).json({ error: "Server processing error" });
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
