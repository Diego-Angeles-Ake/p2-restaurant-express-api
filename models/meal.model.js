const { DataTypes } = require('sequelize');
const { db } = require('../database/database.config');

const Meal = db.define('meal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active',
  },
  restaurantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = { Meal };
