const express = require('express');

// Middleware
const { orderExists } = require('../middlewares/order.middleware');
const { protectToken } = require('../middlewares/user.middleware');
const {
  createOrderValidations,
  checkValidations,
} = require('../middlewares/validations.middleware');

// Controller
const {
  createOrder,
  getUserOrders,
  updateOrder,
  deleteOrder,
} = require('../controllers/order.controller');

const router = express.Router();

// Protected routes
router.use(protectToken);

router.post('/', createOrderValidations, checkValidations, createOrder);
router.get('/me', getUserOrders);
router
  .route('/:id')
  .patch(orderExists, updateOrder)
  .delete(orderExists, deleteOrder);

module.exports = { ordersRouter: router };
