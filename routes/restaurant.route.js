const express = require('express');

// Middleware
const { protectToken, adminAuth } = require('../middlewares/user.middleware');
const {
  restaurantExists,
  reviewOwnerAuth,
} = require('../middlewares/restaurant.middleware');

// Controller
const {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/restaurant.controller');
const {
  checkValidations,
  createRestaurantValidations,
  updateRestaurantValidations,
  createReviewValidations,
  updateReviewValidations,
} = require('../middlewares/validations.middleware');

const router = express.Router();

// Public routes
router.get('/', getRestaurants);
router.get('/:id', restaurantExists, getRestaurant);

// Protected routes
router.use(protectToken);

// Admin specific
router.post(
  '/',
  adminAuth,
  createRestaurantValidations,
  checkValidations,
  createRestaurant
);
router
  .route('/:id')
  .patch(
    adminAuth,
    restaurantExists,
    updateRestaurantValidations,
    checkValidations,
    updateRestaurant
  )
  .delete(adminAuth, restaurantExists, deleteRestaurant);

// User specific
router.post(
  '/reviews/:id',
  restaurantExists,
  createReviewValidations,
  checkValidations,
  createReview
);
router
  .route('/reviews/:restaurantId/:id')
  .patch(
    reviewOwnerAuth,
    updateReviewValidations,
    checkValidations,
    updateReview
  )
  .delete(reviewOwnerAuth, deleteReview);

module.exports = { restaurantsRouter: router };
