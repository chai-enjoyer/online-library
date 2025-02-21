const mongoose = require('mongoose');
const Book = require('../models/Book');
const ReadingList = require('../models/ReadingList');
const Rating = require('../models/Rating');

const createBook = async (req, res) => {
  const { authors, categories, isbn, longDescription, pageCount, publishedDate, shortDescription, status, thumbnailUrl, title } = req.body;
  try {
    const book = new Book({
      authors,
      categories,
      isbn,
      longDescription,
      pageCount,
      publishedDate,
      shortDescription,
      status,
      thumbnailUrl,
      title,
      addedBy: req.user.id,
    });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add book: ' + error.message });
  }
};

const getBooks = async (req, res) => {
  const { title, author, category } = req.query;
  const query = {};
  if (title) query.title = new RegExp(title, 'i');
  if (author) query.authors = new RegExp(author, 'i');
  if (category) query.categories = new RegExp(category, 'i');
  try {
    const books = await Book.find(query).populate('addedBy', 'username');
    const ratings = await Rating.aggregate([
      { $group: { _id: '$bookId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    const booksWithRatings = books.map(book => {
      const ratingData = ratings.find(r => r._id.toString() === book._id.toString());
      return {
        ...book.toObject(),
        avgRating: ratingData ? ratingData.avgRating : 0,
        ratingCount: ratingData ? ratingData.count : 0
      };
    });
    res.json(booksWithRatings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books' });
  }
};

const getBookById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid book ID' });
  }
  try {
    const book = await Book.findById(req.params.id).populate('addedBy', 'username');
    if (!book) return res.status(404).json({ message: 'Book not found' });
    const ratings = await Rating.find({ bookId: book._id });
    const avgRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0;
    res.json({ ...book.toObject(), avgRating, ratingCount: ratings.length });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book' });
  }
};

const updateBook = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid book ID' });
  }
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error updating book' });
  }
};

const deleteBook = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid book ID' });
  }
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    await ReadingList.deleteMany({ bookId: req.params.id });
    await Rating.deleteMany({ bookId: req.params.id });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book' });
  }
};

const addToReadingList = async (req, res) => {
  const { bookId, status } = req.body;
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ message: 'Invalid book ID' });
  }
  try {
    const existing = await ReadingList.findOne({ userId: req.user.id, bookId });
    if (existing) {
      existing.status = status;
      await existing.save();
      return res.status(200).json(existing);
    }
    const readingList = new ReadingList({ userId: req.user.id, bookId, status });
    await readingList.save();
    res.status(201).json(readingList);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to reading list' });
  }
};

const getReadingList = async (req, res) => {
  try {
    const list = await ReadingList.find({ userId: req.user.id }).populate('bookId', 'title authors');
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reading list' });
  }
};

const rateBook = async (req, res) => {
  const { bookId, rating } = req.body;
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ message: 'Invalid book ID' });
  }
  try {
    const existingRating = await Rating.findOne({ userId: req.user.id, bookId });
    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
      return res.status(200).json(existingRating);
    }
    const newRating = new Rating({ userId: req.user.id, bookId, rating });
    await newRating.save();
    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ message: 'Error rating book' });
  }
};

module.exports = { createBook, getBooks, getBookById, updateBook, deleteBook, addToReadingList, getReadingList, rateBook };
