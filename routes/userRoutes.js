const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getAllUsers, updateUser, deleteUser } = require('../controllers/userController');
const { auth, adminOnly } = require('../middleware/auth');
const { validate, profileUpdateSchema } = require('../middleware/validate');

router.get('/profile', auth, getProfile);
router.put('/profile', auth, validate(profileUpdateSchema), updateProfile);
router.get('/all', auth, adminOnly, getAllUsers);
router.put('/:id', auth, adminOnly, updateUser);
router.delete('/:id', auth, adminOnly, deleteUser);

module.exports = router;