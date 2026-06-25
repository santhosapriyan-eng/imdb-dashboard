const Movie = require('../models/Movie');
const { scrapeIMDb } = require('../scraper/imdbScraper');

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

// GET /api/movies/scrape
exports.scrapeMovies = async (req, res) => {
  try {
    const scraped = await scrapeIMDb();
    const saved = [];

    for (const movie of scraped) {
      const existing = await Movie.findOne({ rank: movie.rank });
      if (existing) {
        Object.assign(existing, movie);
        existing.updatedAt = new Date();
        await existing.save();
        saved.push(existing);
      } else {
        const newMovie = new Movie(movie);
        await newMovie.save();
        saved.push(newMovie);
      }
    }

    res.json({ success: true, message: `Scraped and saved ${saved.length} movies`, count: saved.length, data: saved });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/movies/refresh
exports.refreshMovies = async (req, res) => {
  try {
    const scraped = await scrapeIMDb();
    await Movie.deleteMany({});
    const inserted = await Movie.insertMany(scraped);
    res.json({ success: true, message: `Refreshed with ${inserted.length} movies`, count: inserted.length, data: inserted });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
