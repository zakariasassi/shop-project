const { DataTypes, Sequelize } = require('sequelize');
const db = require('../config/db.js');
const Order = require('./Order.js');
const Admin = require('./Admin.js');
const Product = require('./Product.js');
const Customers = require('./Customer.js');

const WatchedProduct = db.define(
  "WatchedProduct",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    createdAT : {

        type : DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
        allowNull : false
    }
    
  },
  {
    timestamps: false,
    tableName: "WatchedProduct",
  }
);



Product.hasMany(WatchedProduct ,  {
  onDelete: 'CASCADE',  // Cascade delete when an order is deleted
  onUpdate: 'CASCADE'   // Cascade update when an order ID is updated

})
WatchedProduct.belongsTo(Product ,   {
  onDelete: 'CASCADE',  // Cascade delete when an order is deleted
  onUpdate: 'CASCADE'   // Cascade update when an order ID is updated

})



Customers.hasMany(WatchedProduct  , {
  foreignKey : {
    allowNull : true
  }
})
WatchedProduct.belongsTo(Customers  , {
  foreignKey : {
    allowNull : true
  }
})

async function syncModels() {
  try {
    await WatchedProduct.sync({ alter: false });
    console.log("WatchedProduct sync complete ✅");
  } catch (error) {
    console.error("WatchedProduct sync failed ❌", error);
  }
}

syncModels();

module.exports = WatchedProduct;
