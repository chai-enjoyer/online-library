const express = require('express');
const router = express.Router();
const { createBook, getBooks, getBookById, updateBook, deleteBook, addToReadingList, getReadingList, deleteFromReadingList, rateBook } = require('../controllers/bookController');
const { auth, adminOnly } = require('../middleware/auth');
const { validate, bookSchema, readingListSchema, ratingSchema } = require('../middleware/validate');

router.post('/', auth, validate(bookSchema), createBook);
router.get('/', auth, getBooks); // Requires authentication
router.get('/:isbn', auth, getBookById);
router.put('/:isbn', auth, validate(bookSchema), updateBook);
router.delete('/reading-list', auth, deleteFromReadingList);
router.delete('/:isbn', auth, deleteBook);
router.post('/reading-list', auth, validate(readingListSchema), addToReadingList);
router.get('/reading-list', auth, getReadingList);
router.post('/rate', auth, validate(ratingSchema), rateBook);

module.exports = router;