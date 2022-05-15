const bcryptjs = require('bcryptjs');
const AppError = require('../helpers/app-error.helper');
const { catchAsync } = require('../helpers/catch-async.helper');
const { User } = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { Order } = require('../models/order.model');
const { Meal } = require('../models/meal.model');
const { Restaurant } = require('../models/restaurant.model');

const signup = catchAsync(async (req, res, next) => {
  // Retrieve data
  const { name, email, password, role } = req.body;

  // Encrypt password
  const salt = await bcryptjs.genSalt(12);
  const hashPassword = await bcryptjs.hash(password, salt);

  // Store user
  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
    role,
  });

  // Obfuscate password
  newUser.password = undefined;

  // Send success response
  res.status(201).json({ newUser });
});

const login = catchAsync(async (req, res, next) => {
  // Retrieve data
  const { email, password } = req.body;

  // Validate that user exists
  const user = await User.findOne({
    where: { email, status: 'active' },
  });

  // Validate credentials
  const areValidCredentials =
    user && (await bcryptjs.compare(password, user.password));
  if (!areValidCredentials) {
    return next(new AppError('Invalid credentials', 400));
  }

  // Generate JWT
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // Obfuscate password
  user.password = undefined;

  // Send success response
  res.status(200).json({ token, user });
});

const updateUser = catchAsync(async (req, res, next) => {
  // Retrieve user from userExists middleware
  const { user } = req;

  // Retrieve data
  const { name, email } = req.body;

  // Update user
  await user.update({ name, email });

  // Send success response
  res.status(200).json({ status: 'success' });
});

const deleteUser = catchAsync(async (req, res, next) => {
  // Retrieve user data from userExists middleware
  const { user } = req;

  // Soft delete user
  await user.update({ status: 'inactive' });

  // Send success response
  res.status(200).json({ status: 'success' });
});

const getOrders = catchAsync(async (req, res, next) => {
  // Retrieve sessionUser from protectToken
  const {
    sessionUser: { id: userId },
  } = req;

  // Get user orders
  const orders = await Order.findAll({
    where: { userId },
    include: [{ model: Meal, include: [{ model: Restaurant }] }],
  });

  // Send success response
  res.status(200).json({ orders });
});

const getOrder = catchAsync(async (req, res, next) => {
  // Retrieve order data from orderExists
  const { order } = req;

  // Send success response
  res.status(200).json({ order });
});

module.exports = {
  signup,
  login,
  updateUser,
  deleteUser,
  getOrders,
  getOrder,
};
