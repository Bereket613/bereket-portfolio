# bereket-portfolio

My personal portfolio website, built with React (Create React App) and Tailwind CSS, hosted on GitHub Pages: [Bereket613.github.io/bereket-portfolio](https://Bereket613.github.io/bereket-portfolio)

## Features

- **Portfolio & GitHub projects** — dynamically fetched from the GitHub API
- **Skills, experience, blog, and CV pages**
- **Dark/light theme** toggle
- **Contact form** — saves messages to the backend API and sends email notifications via EmailJS
- **Admin dashboard** — manage projects, experiences, blog posts, and messages (JWT-authenticated)
- **Chatbot** widget

## Project structure

- `src/` — React frontend
- `server/` — Express + PostgreSQL backend (admin auth, messages, portfolio data)

## Getting started

```bash
# Frontend
npm install
npm start

# Backend (separate terminal)
cd server
npm install
npm start
```

### Environment variables

Copy `.env.example` to `.env` and fill in your values:

- `REACT_APP_EMAILJS_SERVICE_ID` / `REACT_APP_EMAILJS_TEMPLATE_ID` / `REACT_APP_EMAILJS_PUBLIC_KEY` — EmailJS credentials for the contact form
- `REACT_APP_API_URL` — backend API URL (defaults to `http://127.0.0.1:5000`)

The backend has its own `.env.example` under `server/`.

## Available scripts (frontend)

- `npm start` — run the dev server at [http://localhost:3000](http://localhost:3000)
- `npm run build` — build for production to the `build` folder
- `npm test` — run tests
- `npm run deploy` — deploy to GitHub Pages (runs the build first via `predeploy`)

## Deployment

### Frontend

**GitHub Pages (current setup):**
1. Set `homepage` in `package.json` to `https://<user>.github.io/<repo>`.
2. Run `npm run deploy` (builds and publishes the `build` folder to the `gh-pages` branch).

**Vercel:**
1. Import the repo into Vercel.
2. Framework preset: Create React App (auto-detected). Build command `npm run build`, output `build`.
3. Add the `REACT_APP_*` environment variables in Project Settings.
4. If deploying under a custom domain (not a subpath), remove/adjust `basename` in `src/App.js`.

### Backend (Render or Railway)

1. Create a new Web Service pointing at the repo root with:
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `npm start`
2. Set environment variables: `DATABASE_URL`, `JWT_SECRET` (required in production), `PORT` (Render provides it).
3. Add your frontend origin (e.g. `https://<user>.github.io`) to the CORS whitelist in `server/server.js` if different from the defaults.
4. Uploaded images/CVs are stored on the server disk under `server/uploads`. For multi-instance deployments prefer object storage (S3/Cloudinary) instead.

### Database (Supabase or Neon)

1. Create a PostgreSQL instance (Supabase / Neon) and copy the connection string.
2. Set it as `DATABASE_URL` on the backend service. SSL is enabled automatically for non-localhost connections (see `server/db.js`).
3. The schema (`server/schema.sql`) is applied automatically on server startup — including the `visits` analytics table and the `logo_url`/`location`/`resume_url` columns.
4. Create the first admin once via `POST /api/admin/setup` with `{ "username": "...", "password": "..." }` (endpoint locks itself after the first admin exists).

