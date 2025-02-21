const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$'))
    .required()
    .messages({
      'string.pattern.base': 'Password must include at least one number and one special character',
      'string.min': 'Password must be at least 8 characters long'
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const bookSchema = Joi.object({
  authors: Joi.array().items(Joi.string()).min(1).required(),
  categories: Joi.array().items(Joi.string()).min(1).required(),
  isbn: Joi.string().required(),
  longDescription: Joi.string().allow(''),
  pageCount: Joi.number().required(),
  publishedDate: Joi.date().allow(null),
  shortDescription: Joi.string().allow(''),
  status: Joi.string().valid('PUBLISH', 'UNPUBLISH').default('PUBLISH'),
  thumbnailUrl: Joi.string().allow(''),
  title: Joi.string().required(),
});

const readingListSchema = Joi.object({
  isbn: Joi.string().required(), // Changed from bookId to isbn
  status: Joi.string().valid('to-read', 'reading', 'completed').required()
});

const ratingSchema = Joi.object({
  isbn: Joi.string().required(), // Assuming rating also uses isbn now
  rating: Joi.number().min(1).max(5).required(),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

module.exports = { validate, registerSchema, loginSchema, bookSchema, readingListSchema, ratingSchema };
