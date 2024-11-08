const { DataTypes } = require('sequelize');
const Product = require('./Product.js');
const db = require('../config/db.js');
const Order = require('./Order.js');


const OrderItem = db.define('OrderItem', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  createdAt : {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  
}, {
  tableName: 'OrderItem',

});


Order.hasMany(OrderItem, { foreignKey: 'OrderId' });
OrderItem.belongsTo(Order, { foreignKey: 'OrderId' });

OrderItem.belongsTo(Product, { foreignKey: 'ProductId'});


async function syncModels() {
  try {
    await OrderItem.sync({ alter: false });
    console.log('OrderItem sync complete ✅');
  } catch (error) {
    console.error('OrderItem sync failed ❌', error);
  }
}

syncModels();


module.exports =  OrderItem;
