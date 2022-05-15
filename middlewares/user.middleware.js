const AppError = require('../helpers/app-error.helper');
const { catchAsync } = require('../helpers/catch-async.helper');
const { User } = require('../models/user.model');
const jwt = require('jsonwebtoken');

const userExists = catchAsync(async (req, res, next) => {
  // Retrieve query string data
  const { id } = req.params;

  // Search for user with given id
  const user = await User.findOne({
    where: { id, status: 'active' },
    // Obfuscate password
    attributes: { exclude: ['password'] },
  });

  if (!user) return next(new AppError('User not found with given ID', 404));

  // Append user data to the req object
  req.user = user;
  next();
});

const protectToken = catchAsync(async (req, res, next) => {
  // Validate token
  let token;
  const isValidAuthHeader =
    req.headers.authorization && req.headers.authorization.startsWith('Bearer');
  if (isValidAuthHeader) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('Session invalid', 403));
  }

  // Search for user with decoded token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({
    where: { id: decoded.id, status: 'active' },
  });

  if (!user) {
    return next(
      new AppError('The owner of this token is no longer available', 403)
    );
  }

  req.sessionUser = user;
  next();
});

const ownerAuth = catchAsync(async (req, res, next) => {
  // Retrieve user from userExists and sessionUser from protectToken
  const { sessionUser, user } = req;

  if (sessionUser.id !== user.id) {
    return next(new AppError('You do not own this account', 403));
  }

  next();
});

const adminAuth = catchAsync(async (req, res, next) => {
  if (req.sessionUser.role !== 'admin') {
    return next(new AppError('Access not granted', 403));
  }

  next();
});

module.exports = {
  userExists,
  protectToken,
  ownerAuth,
  adminAuth,
};
