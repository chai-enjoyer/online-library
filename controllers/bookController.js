const Book = require('../models/Book');
const User = require('../models/User');
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
  const { isbn } = req.params;
  try {
    const book = await Book.findOne({ isbn }).populate('addedBy', 'username');
    if (!book) return res.status(404).json({ message: 'Book not found' });
    const ratings = await Rating.find({ bookId: book._id });
    const avgRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0;
    res.json({ ...book.toObject(), avgRating, ratingCount: ratings.length });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book' });
  }
};

const updateBook = async (req, res) => {
  const { isbn } = req.params;
  try {
    const book = await Book.findOneAndUpdate({ isbn }, req.body, { new: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error updating book' });
  }
};

const deleteBook = async (req, res) => {
  const { isbn } = req.params;
  try {
    const book = await Book.findOneAndDelete({ isbn });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    await User.updateMany(
      { 'readingList.isbn': isbn },
      { $pull: { readingList: { isbn } } }
    );
    await Rating.deleteMany({ bookId: book._id });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book' });
  }
};

const addToReadingList = async (req, res) => {
  const { isbn, status } = req.body;
  console.log('Received payload:', { isbn, status });
  try {
    if (!isbn) return res.status(400).json({ message: 'ISBN is required' });
    if (!status) return res.status(400).json({ message: 'Status is required' });

    const book = await Book.findOne({ isbn });
    if (!book) {
      console.log(`Book not found for ISBN: ${isbn}`);
      return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const existingEntry = user.readingList.find(item => item.isbn === isbn);
    if (existingEntry) {
      existingEntry.status = status;
    } else {
      user.readingList.push({ isbn, status });
    }
    await user.save();
    res.status(existingEntry ? 200 : 201).json({ message: existingEntry ? 'Updated reading list' : 'Added to reading list' });
  } catch (error) {
    console.error('Error in addToReadingList:', error);
    res.status(500).json({ message: 'Error adding to reading list: ' + error.message });
  }
};

const getReadingList = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('readingList');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Handle case where readingList might not exist or is empty
    if (!user.readingList || user.readingList.length === 0) {
      return res.json([]);
    }

    // Return only the ISBN-based reading list entries
    const readingList = user.readingList.map(item => ({
      isbn: item.isbn,
      status: item.status,
      addedAt: item.addedAt
    }));
    res.json(readingList);
  } catch (error) {
    console.error('Error in getReadingList:', error);
    res.status(500).json({ message: 'Error fetching reading list: ' + error.message });
  }
};

const rateBook = async (req, res) => {
  const { isbn, rating } = req.body;
  try {
    const book = await Book.findOne({ isbn });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    const existingRating = await Rating.findOne({ userId: req.user.id, bookId: book._id });
    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
      return res.status(200).json(existingRating);
    }
    const newRating = new Rating({ userId: req.user.id, bookId: book._id, rating });
    await newRating.save();
    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ message: 'Error rating book' });
  }
};

module.exports = { createBook, getBooks, getBookById, updateBook, deleteBook, addToReadingList, getReadingList, rateBook };
