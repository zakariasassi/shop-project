const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/db.js');


const WebsiteVisit = db.define('WebsiteVisit', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      visitDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      os:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      browser: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      device : {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      visitCount: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
}, {
  
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false,
});

async function syncModels() {
    try {
      await WebsiteVisit.sync({alter : false});
      console.log("WebsiteVisit sync complete ✅");
    } catch (error) {
      console.error("WebsiteVisit sync failed ❌", error);
    }
  }
  
  syncModels();


module.exports = WebsiteVisit
