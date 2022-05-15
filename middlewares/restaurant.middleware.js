const AppError = require('../helpers/app-error.helper');
const { catchAsync } = require('../helpers/catch-async.helper');
const { Meal } = require('../models/meal.model');
const { Restaurant } = require('../models/restaurant.model');
const { Review } = require('../models/review.model');

const restaurantExists = catchAsync(async (req, res, next) => {
  // Retrieve from query string
  const { id } = req.params;

  // Search for restaurant with given ID
  const restaurant = await Restaurant.findOne({
    where: { id, status: 'active' },
    include: [Meal, Review],
  });

  if (!restaurant) {
    return next(new AppError('No restaurant found with given ID', 404));
  }

  // Append restaurant data to the req object
  req.restaurant = restaurant;
  next();
});

const reviewOwnerAuth = catchAsync(async (req, res, next) => {
  // Retrieve userId from protectToken
  const {
    sessionUser: { id: userId },
  } = req;

  // Retrieve data
  const { restaurantId, id } = req.params;

  // Verify restaurant existance
  const restaurant = await Restaurant.findOne({
    where: {
      id: restaurantId,
      status: 'active',
    },
  });
  if (!restaurant)
    return next(new AppError('No restaurant found given that ID'));

  // Search for user review
  const review = await Review.findOne({
    where: {
      id,
      // Use current user id, therefore, only a review madre from the user is retrieved
      userId,
      restaurantId,
    },
  });

  if (!review) {
    return next(
      new AppError(`No review found for the restaurant ${restaurant.name}`, 404)
    );
  }

  // Append review and restaurant data to the req object
  req.review = review;
  req.restaurant = restaurant;
  next();
});

module.exports = { restaurantExists, reviewOwnerAuth };
