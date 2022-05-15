const { body, validationResult } = require('express-validator');
const AppError = require('../helpers/app-error.helper');

const signUpValidations = [
  body('name').notEmpty().withMessage('Must provide a name'),
  body('email').notEmpty().isEmail().withMessage('Must provide a valid email'),
  body('password')
    .notEmpty()
    .isStrongPassword({ minSymbols: 0 })
    .withMessage(
      'Must provide a password with a minimum length of 8 characters, 1 uppercase character and 1 lowercase character'
    ),
  body('role')
    .default('normal')
    .isIn(['admin', 'normal'])
    .notEmpty()
    .withMessage('Must provide a valid role'),
];

const loginValidations = [
  body('email').notEmpty().withMessage('Must provide an email'),
  body('password').notEmpty().withMessage('Must provide a password'),
];

const createRestaurantValidations = [
  body('name')
    .notEmpty()
    .withMessage('Must provide a name')
    .isLength({ max: 46 })
    .withMessage('Max name length is 46 characters '),
  body('address')
    .notEmpty()
    .withMessage('Must provide a address')
    .isLength({ max: 95 })
    .withMessage('Max address length is 95 characters'),
  body('rating')
    .notEmpty()
    .withMessage('Must provide a rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Must be an integer between 1 and 5'),
];

const updateRestaurantValidations = [
  body('name')
    .isLength({ max: 46 })
    .withMessage('Max name length is 46 characters'),
  body('address')
    .isLength({ max: 95 })
    .withMessage('Max address length is 95 characters'),
];

const createReviewValidations = [
  body('comment')
    .notEmpty()
    .withMessage('Must provide a comment')
    .isLength({ max: 280 })
    .withMessage('Max comment length is 280 characters'),
  body('rating')
    .notEmpty()
    .withMessage('Must provide a rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Must be an integer between 1 and 5'),
];

const updateReviewValidations = [
  body('comment')
    .isLength({ max: 280 })
    .withMessage('Max comment length is 280 characters'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Must be an integer between 1 and 5'),
];

const createMealValidations = [
  body('name')
    .notEmpty()
    .withMessage('Must provide a name')
    .isLength({ max: 46 })
    .withMessage('Max name length is 46 characters'),
  body('price')
    .notEmpty()
    .withMessage('Must provide a price')
    .isInt({ min: 0, max: 99999 })
    .withMessage('Price must be an integer between 0-99999'),
];

const updateMealValidations = [
  body('name')
    .isLength({ max: 46 })
    .withMessage('Max name length is 46 characters'),
  body('price')
    .isInt({ min: 0, max: 99999 })
    .withMessage('Price must be an integer between 0-99999'),
];

const createOrderValidations = [
  body('quantity')
    .notEmpty()
    .withMessage('Must provide a quantity')
    .isInt({ allow_leading_zeroes: false, min: 1 })
    .withMessage('Must provide a valid quantity'),
  body('mealId')
    .notEmpty()
    .withMessage('Must provide a mealId')
    .isInt({ allow_leading_zeroes: false, min: 1 })
    .withMessage('mealId must be an integer'),
];

const checkValidations = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map(({ msg }) => msg);

    // [msg, msg, msg] -> 'msg. msg. msg'
    const errorMsg = messages.join('.\n');

    return next(new AppError(errorMsg, 400));
  }

  next();
};

module.exports = {
  signUpValidations,
  loginValidations,
  createRestaurantValidations,
  updateRestaurantValidations,
  createReviewValidations,
  updateReviewValidations,
  createMealValidations,
  updateMealValidations,
  createOrderValidations,
  checkValidations,
};
