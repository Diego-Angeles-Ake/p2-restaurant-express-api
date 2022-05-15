const { catchAsync } = require('../helpers/catch-async.helper');
const { Meal } = require('../models/meal.model');
const { Restaurant } = require('../models/restaurant.model');

const getMeals = catchAsync(async (req, res, next) => {
  // Search for active meals
  const meals = await Meal.findAll({
    where: {
      status: 'active',
    },
    include: [Restaurant],
  });

  // Send success response
  res.status(200).json({ meals });
});

const getMeal = catchAsync(async (req, res, next) => {
  // Retrieve meal from mealExists middleware
  const { meal } = req;

  // Send success response
  res.status(200).json({ meal });
});

const createMeal = catchAsync(async (req, res, next) => {
  // Retrieve restaurantId from restaurantExists middleware
  const {
    restaurant: { id: restaurantId },
  } = req;

  // Retrieve data
  const { name, price } = req.body;

  // Create record
  const meal = await Meal.create({
    name,
    price,
    restaurantId,
  });

  // Send success response
  res.status(200).json({ meal });
});

const updateMeal = catchAsync(async (req, res, next) => {
  // Retrieve meal from mealExists middleware
  const { meal } = req;

  // Retrieve data
  const { name, price } = req.body;

  // Update record
  await meal.update({ name, price });

  // Send success response
  res.status(200).json({ status: 'success' });
});

const deleteMeal = catchAsync(async (req, res, next) => {
  // Retrieve meal from mealExists middleware
  const { meal } = req;

  // Soft-delete record
  await meal.update({ status: 'deleted' });

  // Send success response
  res.status(200).json({ status: 'success' });
});

module.exports = {
  getMeals,
  getMeal,
  createMeal,
  updateMeal,
  deleteMeal,
};
