const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  authors: [{ type: String, required: true }],
  categories: [{ type: String, required: true }],
  isbn: { type: String, required: true, unique: true },
  longDescription: { type: String },
  pageCount: { type: Number, required: true },
  publishedDate: { type: Date },
  shortDescription: { type: String },
  status: { type: String, enum: ['PUBLISH', 'UNPUBLISH'], default: 'PUBLISH' },
  thumbnailUrl: { type: String },
  title: { type: String, required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
