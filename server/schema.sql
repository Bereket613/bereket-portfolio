CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    tech_stack TEXT[], -- Array of strings
    live_demo_url VARCHAR(255),
    github_url VARCHAR(255),
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS experiences (
    id SERIAL PRIMARY KEY,
    role VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    duration VARCHAR(100),
    description TEXT,
    key_achievements TEXT[],
    tech_stack TEXT[],
    logo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profile (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    title VARCHAR(255),
    about TEXT,
    logo_url VARCHAR(255),
    email VARCHAR(255),
    github VARCHAR(255),
    linkedin VARCHAR(255),
    location VARCHAR(255),
    resume_url VARCHAR(255)
);

-- Lightweight anonymous visit tracking for analytics
CREATE TABLE IF NOT EXISTS visits (
    id SERIAL PRIMARY KEY,
    page VARCHAR(255),
    user_agent VARCHAR(512),
    visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Idempotent migrations for pre-existing databases
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS logo_url VARCHAR(255);
ALTER TABLE profile ADD COLUMN IF NOT EXISTS location VARCHAR(255);
ALTER TABLE profile ADD COLUMN IF NOT EXISTS resume_url VARCHAR(255);
ALTER TABLE projects ALTER COLUMN image_url TYPE VARCHAR(512);
ALTER TABLE experiences ALTER COLUMN logo_url TYPE VARCHAR(512);
ALTER TABLE profile ALTER COLUMN logo_url TYPE VARCHAR(512);
ALTER TABLE profile ALTER COLUMN resume_url TYPE VARCHAR(512);

CREATE INDEX IF NOT EXISTS idx_visits_visited_at ON visits (visited_at);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages (created_at);
