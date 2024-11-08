const { DataTypes } = require('sequelize');
const db = require('../config/db.js');


const Coupon = db.define( "Coupon", {
  
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
    
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    discountPercentage: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt : {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    }
}, {
    timestamps: false,
    tableName: "Coupon",
  } );


async function syncModels() {
    try {
      await Coupon.sync({ alter: false });
      console.log("Coupon sync complete ✅");
    } catch (error) {
      console.error("Coupon sync failed ❌", error);
    }
  }
  
  syncModels();
  
module.exports = Coupon








