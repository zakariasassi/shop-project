const { DataTypes } = require('sequelize');
const db = require('../config/db.js');

const Offer = db.define('Offer', {
    id: {

        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement: true,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    discountPercentage: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    image : {
        type : DataTypes.STRING,
        allowNull : true
    },
    discountAmount: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    state:{
        type : DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true
    },

    createdAt : {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      }
},{
    timestamps : false
});


async function syncModels() {
    try {
      await Offer.sync({alter  : false});
      console.log("Offer sync complete ✅");
    } catch (error) {
      console.error("Offer sync failed ❌", error);
    }
  }
  
  syncModels();

module.exports = Offer;
