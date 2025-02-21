const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  readingList: [{
    isbn: { type: String, required: true },
    status: { type: String, enum: ['to-read', 'reading', 'completed'], default: 'to-read' },
    addedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
