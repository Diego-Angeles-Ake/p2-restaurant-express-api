const AppError = require('../helpers/app-error.helper');
const { catchAsync } = require('../helpers/catch-async.helper');
const { Meal } = require('../models/meal.model');
const { Order } = require('../models/order.model');
const { Restaurant } = require('../models/restaurant.model');

const orderExists = catchAsync(async (req, res, next) => {
  // Retrieve data from query string and sessionUser from protectToken
  const { id } = req.params;
  const {
    sessionUser: { id: userId },
  } = req;

  // Search for order with given id
  const order = await Order.findOne({
    where: { id, userId, status: 'active' },
    include: [{ model: Meal, include: [{ model: Restaurant }] }],
  });

  if (!order) return next(new AppError('No order found with given ID', 404));

  // Append order data to the req object
  req.order = order;
  next();
});

module.exports = { orderExists };
