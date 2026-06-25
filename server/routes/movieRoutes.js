const express = require('express');
const router = express.Router();
const { getMovies, getMovieById, scrapeMovies, refreshMovies } = require('../controllers/movieController');

router.get('/', getMovies);
router.get('/scrape', scrapeMovies);
router.post('/refresh', refreshMovies);
router.get('/:id', getMovieById);

module.exports = router;
