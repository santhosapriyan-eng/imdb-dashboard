const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  rank: { type: Number, required: true },
  title: { type: String, required: true },
  weekendGross: { type: String, default: 'N/A' },
  totalGross: { type: String, default: 'N/A' },
  weeks: { type: Number, default: 1 },
  imdbUrl: { type: String, default: '' },
  poster: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

movieSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Movie', movieSchema);
