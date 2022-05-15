const { catchAsync } = require('../helpers/catch-async.helper');
const { Meal } = require('../models/meal.model');
const { Restaurant } = require('../models/restaurant.model');
const { Review } = require('../models/review.model');

const getRestaurants = catchAsync(async (req, res, next) => {
  // Search for active restaurants
  const restaurants = await Restaurant.findAll({
    where: {
      status: 'active',
    },
    include: [{ model: Meal }, { model: Review }],
  });

  // Send success response
  res.status(200).json({ restaurants });
});

const getRestaurant = catchAsync(async (req, res, next) => {
  // Retrieve restaurant from restaurantExists middleware
  const { restaurant } = req;

  // Send success response
  res.status(200).json({ restaurant });
});

const createRestaurant = catchAsync(async (req, res, next) => {
  // Retrieve data
  const { name, address, rating } = req.body;

  // Create restaurant record
  const restaurant = await Restaurant.create({
    name,
    address,
    rating,
  });

  // Send success response
  res.status(201).json({ restaurant });
});

const updateRestaurant = catchAsync(async (req, res, next) => {
  // Retrieve restaurant from restaurantExists middleware
  const { restaurant } = req;

  // Retrieve data
  const { name, address } = req.body;

  // Update record
  await restaurant.update({ name, address });

  // Send succes response
  res.status(200).json({ status: 'success' });
});

const deleteRestaurant = catchAsync(async (req, res, next) => {
  // Retrieve restaurant from restaurantExists middleware
  const { restaurant } = req;

  // Soft-delete record
  await restaurant.update({ status: 'inactive' });

  // Send success response
  res.status(200).json({ status: 'success' });
});

const createReview = catchAsync(async (req, res, next) => {
  // Retrieve restaurantId from restaurantExists middleware
  const {
    restaurant: { id: restaurantId },
  } = req;

  // Retrieve userId from protectToken middleware
  const {
    sessionUser: { id: userId },
  } = req;

  // Retrieve data
  const { comment, rating } = req.body;

  // Create record
  const review = await Review.create({
    comment,
    rating,
    userId,
    restaurantId,
  });

  // Send success response
  res.status(201).json({ review });
});

const updateReview = catchAsync(async (req, res, next) => {
  // Retrieve review from reviewOwnerAuth middleware
  const { review } = req;

  // Retrieve data
  const { comment, rating } = req.body;

  // Update record
  await review.update({ comment, rating });

  // Send success response
  res.status(200).json({ status: 'success' });
});

const deleteReview = catchAsync(async (req, res, next) => {
  // Retrieve review from reviewOwnerAuth middleware
  const { review } = req;

  // Soft-delete record
  await review.update({ status: 'deleted' });

  // Send success response
  res.status(200).json({ status: 'success' });
});

module.exports = {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  createReview,
  updateReview,
  deleteReview,
};
