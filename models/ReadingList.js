const mongoose = require('mongoose');

const readingListSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  status: { type: String, enum: ['to-read', 'reading', 'completed'], default: 'to-read' },
}, { timestamps: true });

module.exports = mongoose.model('ReadingList', readingListSchema);
