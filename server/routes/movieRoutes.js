const express = require('express');
const router = express.Router();
const { getMovies, getMovieById, scrapeMovies, refreshMovies, updateMovie } = require('../controllers/movieController');

router.get('/', getMovies);
router.get('/scrape', scrapeMovies);
router.post('/refresh', refreshMovies);
router.get('/:id', getMovieById);
router.put('/:id', updateMovie);

module.exports = router;
