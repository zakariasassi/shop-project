const { DataTypes } = require('sequelize');
const db = require('../config/db.js');
const Customers = require('./Customer.js');

const Order = db.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    paymentMethod:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    customerId: DataTypes.INTEGER,
    totalAmount: DataTypes.FLOAT,
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
    createdAt : {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    }
  },
  {
    timestamps: false,
    tableName: "Order",
  }
);


Customers.hasMany(Order , {foreignKey : 'customerId'});
Order.belongsTo(Customers, {foreignKey : 'customerId' })


async function syncModels() {
  try {
    await Order.sync({ alter: false });
    console.log("Order sync complete ✅");
  } catch (error) {
    console.error("Order sync failed ❌", error);
  }
}

syncModels();

module.exports = Order;
