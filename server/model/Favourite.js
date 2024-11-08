const { DataTypes } = require('sequelize');
const db = require('../config/db.js');
const Customers = require('./Customer.js');
const Product = require('./Product.js');


const Favourite = db.define(
  "Favourite",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    createdAt : {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    }
  },
  {
    timestamps: false,
    tableName: "Favourite",
  }
);


Favourite.belongsTo(Product  );
Favourite.belongsTo(Customers );


async function syncModels() {
  try {
    await Favourite.sync({ alter: false });
    console.log("Favourite sync complete ✅");
  } catch (error) {
    console.error("Favourite sync failed ❌", error);
  }
}

syncModels();

module.exports = Favourite;
