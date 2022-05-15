const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { globalErrorHandler } = require('./controllers/error.controller');
// Routes
const { mealsRouter } = require('./routes/meal.route');
const { ordersRouter } = require('./routes/order.route');
const { restaurantsRouter } = require('./routes/restaurant.route');
const { usersRouter } = require('./routes/user.route');

const app = express();

// Enable CORS
app.use(cors());
// Enable JSON
app.use(express.json());
// Request Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
// Apply the rate limiting middleware to API calls only
app.use('/api', apiLimiter);
// Endpoints
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/restaurants', restaurantsRouter);
app.use('/api/v1/meals', mealsRouter);
app.use('/api/v1/orders', ordersRouter);
// Global error handler
app.use('*', globalErrorHandler);

module.exports = { app };
