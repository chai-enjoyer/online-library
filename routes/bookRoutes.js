const express = require('express');
const router = express.Router();
const { createBook, getBooks, getBookById, updateBook, deleteBook, addToReadingList, getReadingList, rateBook } = require('../controllers/bookController');
const { auth, adminOnly } = require('../middleware/auth');
const { validate, bookSchema, readingListSchema, ratingSchema } = require('../middleware/validate');

router.post('/', auth, validate(bookSchema), createBook);
router.get('/', getBooks);
router.get('/:isbn', getBookById);
router.put('/:isbn', auth, adminOnly, validate(bookSchema), updateBook);
router.delete('/:isbn', auth, adminOnly, deleteBook);
router.post('/reading-list', auth, validate(readingListSchema), addToReadingList);
router.get('/reading-list', auth, getReadingList);
router.post('/rate', auth, validate(ratingSchema), rateBook);

module.exports = router;
