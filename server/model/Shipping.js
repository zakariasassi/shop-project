const  { DataTypes } =  require('sequelize');
const  db =  require('../config/db.js');
const Order = require('./Order.js');

const Shipping = db.define('Shipping', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    fullName:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    address:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    city:{
        type: DataTypes.STRING,
        allowNull: false,
    },

    createdAt : {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    }
});

Shipping.belongsTo(Order , {
  foreignKey : {
    allowNull : true
  }
})
Order.hasOne(Shipping  )

async function syncModels() {
  try {
    await Shipping.sync({alter: false});

    console.log("Shipping sync complete ✅");
  } catch (error) {
    console.error("Shipping sync failed ❌", error);
  }
}

syncModels();

module.exports = Shipping;
