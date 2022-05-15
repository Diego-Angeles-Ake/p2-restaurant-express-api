const { catchAsync } = require('../helpers/catch-async.helper');
const { Meal } = require('../models/meal.model');
const { Order } = require('../models/order.model');
const { Restaurant } = require('../models/restaurant.model');

const createOrder = catchAsync(async (req, res, next) => {
  // Retrieve userId from protectToken middleware
  const {
    sessionUser: { id: userId },
  } = req;

  // Retrieve data
  const { quantity, mealId } = req.body;

  // Search for meal price
  const meal = await Meal.findOne({ where: { id: mealId } });
  const price = parseInt(meal.price) * parseInt(quantity);

  // Create record
  const order = await Order.create({
    quantity,
    price,
    mealId,
    userId,
  });

  // Send success response
  res.status(201).json({ order });
});

const getUserOrders = catchAsync(async (req, res, next) => {
  // Retrieve userId from protectToken middleware
  const {
    sessionUser: { id: userId },
  } = req;

  // Search for current user orders
  const orders = await Order.findAll({
    where: {
      userId,
    },
    include: [{ model: Meal, include: [{ model: Restaurant }] }],
  });

  // Send success response
  res.status(200).json({ orders });
});

const updateOrder = catchAsync(async (req, res, next) => {
  // Retrieve order from orderExists
  const { order } = req;

  // Set order status to completed
  await order.update({
    status: 'completed',
  });

  // Send success response
  res.status(200).json({ status: 'success' });
});

const deleteOrder = catchAsync(async (req, res, next) => {
  // Retrieve order from orderExists
  const { order } = req;

  // Set order status cancelled
  await order.update({ status: 'cancelled' });

  // Send success response
  res.status(200).json({ status: 'success' });
});

module.exports = {
  createOrder,
  getUserOrders,
  updateOrder,
  deleteOrder,
};
