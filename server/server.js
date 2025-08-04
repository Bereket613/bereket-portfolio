// server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 5000;
const GIST_ID = process.env.GIST_ID;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GIST_FILENAME = process.env.GIST_FILENAME

// --- INITIAL CONFIGURATION & CHECKS ---
if (!GIST_ID || !GITHUB_TOKEN) {
    console.error('CRITICAL ERROR: GIST_ID and GITHUB_TOKEN must be set in your .env file.');
    console.error('The server cannot function without these.');
    process.exit(1); // Exit if critical variables are missing
}

// ** This is the critical part for CORS. It allows requests from your frontend. **
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// --- GITHUB GIST API FUNCTIONS ---
async function getProjectsFromGist() {
    console.log('Attempting to fetch projects from Gist...');
    try {
        const response = await axios.get(`https://api.github.com/gists/${GIST_ID}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Portfolio-App-Server'
            },
            timeout: 10000
        });

        console.log("fg", response.data.files, response.data.files)

        if (!response.data.files) {
            console.error('Error: Gist file not found.', { files: Object.keys(response.data.files) });
            throw new Error(`Gist file not found. Please ensure it exists.`);
        }
        const content = response.data.files[GIST_FILENAME].content;
        try {
            return JSON.parse(content);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError.message);
            throw new Error('Invalid JSON format in Gist file. Please correct it manually.');
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        const errorStatus = error.response?.status;
        console.error('GitHub API Get Error:', { status: errorStatus, message: errorMessage });
        throw new Error(`GitHub API Error: ${errorMessage}`);
    }
}

// ... (updateGist function and API endpoints are the same as before)
async function updateGist(projects) {
    try {
        const response = await axios.patch(
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
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Portfolio-App-Server'
                },
                timeout: 10000
            }
        );
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(`Failed to update Gist: ${errorMessage}`);
    }
}

app.get('/api/projects', async (req, res) => {
    try {
        const projects = await getProjectsFromGist();
        res.json(projects);
    } catch (error) {
        console.error('GET /api/projects failed:', error.message);
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
        console.log("post prob" )
        
        const newProject = {
            id: Date.now().toString(),
            title,
            description: description || '',
            link,
            category: category || 'Data Analysis',
            createdAt: new Date().toISOString()
        };
        const updatedProjects = [...projects, newProject];
        await updateGist(updatedProjects);
        res.status(201).json(updatedProjects);
    } catch (error) {
        console.error('POST /api/projects failed:', error.message);
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
        res.json(updatedProjects);
    } catch (error) {
        console.error('DELETE /api/projects failed:', error.message);
        res.status(500).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔗 CORS configured for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});