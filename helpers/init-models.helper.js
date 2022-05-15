const { Meal } = require('../models/meal.model');
const { Order } = require('../models/order.model');
const { Restaurant } = require('../models/restaurant.model');
const { Review } = require('../models/review.model');
const { User } = require('../models/user.model');

const initModels = () => {
  // User 1:1 Order
  User.hasMany(Order);
  Order.belongsTo(User);
  // Order 1:1 Meal
  Meal.hasOne(Order);
  Order.belongsTo(Meal, { foreignKey: 'mealId' });
  // Restaurant 1:M Meal
  Restaurant.hasMany(Meal);
  Meal.belongsTo(Restaurant);
  // Restaurant 1:M Reviews
  Restaurant.hasMany(Review);
  Review.belongsTo(Restaurant);
  // User 1:M Reviews
  User.hasMany(Review);
  Review.belongsTo(User);
};

module.exports = { initModels };
