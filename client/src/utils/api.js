import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

export const fetchMovies = () => api.get('/movies');
export const scrapeMovies = () => api.get('/movies/scrape');
export const refreshMovies = () => api.post('/movies/refresh');
export const fetchMovieById = (id) => api.get(`/movies/${id}`);
export const checkHealth = () => api.get('/health');

export default api;
