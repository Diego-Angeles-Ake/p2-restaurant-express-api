const express = require('express');

// Middleware
const { protectToken, adminAuth } = require('../middlewares/user.middleware');
const { mealExists } = require('../middlewares/meal.middleware');
const {
  createMealValidations,
  checkValidations,
  updateMealValidations,
} = require('../middlewares/validations.middleware');
const { restaurantExists } = require('../middlewares/restaurant.middleware');
const {
  getMeals,
  getMeal,
  createMeal,
  updateMeal,
  deleteMeal,
} = require('../controllers/meal.controller');

// Controller

const router = express.Router();

// Public routes
router.get('/', getMeals);
router.get('/:id', mealExists, getMeal);

// Protected routes
router.use(protectToken);

// Admin specific
router.post(
  '/:id',
  restaurantExists,
  adminAuth,
  createMealValidations,
  checkValidations,
  createMeal
);
router
  .route('/:id')
  .patch(
    mealExists,
    adminAuth,
    updateMealValidations,
    checkValidations,
    updateMeal
  )
  .delete(mealExists, adminAuth, deleteMeal);

module.exports = { mealsRouter: router };
