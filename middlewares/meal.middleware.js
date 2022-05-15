const AppError = require('../helpers/app-error.helper');
const { catchAsync } = require('../helpers/catch-async.helper');
const { Meal } = require('../models/meal.model');

const mealExists = catchAsync(async (req, res, next) => {
  // Retrieve meal ID from query string
  const { id } = req.params;

  // Search for meal with given ID
  const meal = await Meal.findOne({
    where: {
      id,
      status: 'active',
    },
  });

  if (!meal) return next(new AppError('No meal found given that ID', 404));

  // Append meal data to the req object
  req.meal = meal;
  next();
});

module.exports = { mealExists };
