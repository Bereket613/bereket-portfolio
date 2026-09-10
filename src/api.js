import axios from 'axios';

// API base URL resolution order:
// 1. window.__APP_CONFIG__.API_URL — set in public/config.js, editable on the
//    deployed site (gh-pages) without a rebuild
// 2. REACT_APP_API_URL — build-time env var
// 3. localhost — local development fallback
export const API_URL =
  (typeof window !== 'undefined' && window.__APP_CONFIG__ && window.__APP_CONFIG__.API_URL) ||
  process.env.REACT_APP_API_URL ||
  'http://localhost:5000';

// Resolve backend-relative paths (e.g. /uploads/...) against the API origin
export const absoluteUrl = (path) => {
  if (!path) return path;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('portfolio-admin-token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
