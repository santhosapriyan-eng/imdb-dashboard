require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cron = require('node-cron');
const movieRoutes = require('./routes/movieRoutes');
const { scrapeIMDb } = require('./scraper/imdbScraper');
const Movie = require('./models/Movie');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/imdb_dashboard';

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/movies', movieRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Auto-refresh every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  console.log('⏰ Auto-refresh: scraping IMDb...');
  try {
    const scraped = await scrapeIMDb();
    await Movie.deleteMany({});
    await Movie.insertMany(scraped);
    console.log(`✅ Auto-refresh complete: ${scraped.length} movies updated`);
  } catch (e) {
    console.error('❌ Auto-refresh failed:', e.message);
  }
});

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    // Initial seed if empty
   console.log('📦 Refreshing data...');
   await Movie.deleteMany({});
   const data = await scrapeIMDb();
   await Movie.insertMany(data);
   console.log(`🎬 Seeded ${data.length} movies`);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start:', err);
    process.exit(1);
  }
}

start();
