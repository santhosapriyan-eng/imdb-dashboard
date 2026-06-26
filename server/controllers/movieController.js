const Movie = require('../models/Movie');

// GET /api/movies
exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ rank: 1 });
    res.json({ success: true, count: movies.length, data: movies });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/movies/:id
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ success: false, error: 'Movie not found' });
    res.json({ success: true, data: movie });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /api/movies/:id
exports.updateMovie = async (req, res) => {
  try {
    const { title, weekendGross, totalGross, weeks } = req.body;
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { title, weekendGross, totalGross, weeks, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!movie) return res.status(404).json({ success: false, error: 'Movie not found' });
    res.json({ success: true, data: movie });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/movies/scrape (Disabled for Option 3 - Just returns current DB data)
exports.scrapeMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ rank: 1 });
    res.json({ success: true, message: 'Scraping disabled. Returning DB data.', count: movies.length, data: movies });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/movies/refresh (Disabled for Option 3 - Just returns current DB data)
exports.refreshMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ rank: 1 });
    res.json({ success: true, message: 'Refresh disabled. Returning DB data.', count: movies.length, data: movies });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
