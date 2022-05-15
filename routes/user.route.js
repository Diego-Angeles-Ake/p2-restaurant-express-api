const express = require('express');

// Middlewares
// Controllers
const {
  signup,
  login,
  updateUser,
  deleteUser,
  getOrders,
  getOrder,
} = require('../controllers/user.controller');
const { orderExists } = require('../middlewares/order.middleware');
const {
  userExists,
  protectToken,
  ownerAuth,
} = require('../middlewares/user.middleware');

const {
  loginValidations,
  checkValidations,
  signUpValidations,
} = require('../middlewares/validations.middleware');

const router = express.Router();

// Public routes
router.post('/signup', signUpValidations, checkValidations, signup);
router.post('/login', loginValidations, checkValidations, login);

// Protected routes
router.use(protectToken);
router
  .route('/:id')
  .patch(userExists, ownerAuth, updateUser)
  .delete(userExists, ownerAuth, deleteUser);

router.get('/orders', getOrders);
router.get('/orders/:id', orderExists, getOrder);

module.exports = { usersRouter: router };
