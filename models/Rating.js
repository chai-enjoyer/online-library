const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
}, { timestamps: true });

ratingSchema.index({ userId: 1, bookId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
