const { DataTypes } = require('sequelize');
const db = require('../config/db.js');
const Order = require('./Order.js');
const Admin = require('./Admin.js');
const Customers = require('./Customer.js');



const UserLocation = db.define('UserLocation', {
    id:{
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement: true,
        allowNull: false,
    },
    Latitude: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Longitude : {
    type: DataTypes.STRING,
    allowNull: false,
  },
  placeType : {
    type: DataTypes.STRING,
    allowNull: false,
  },
  placeDescription : {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt : {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  }

},{
    timestamps: false,
    tableName: 'UserLocation',
});


UserLocation.belongsTo(Customers  , {
  foreignKey : {
    allowNull : true
  }
});
Customers.hasMany(UserLocation  , {
  foreignKey : {
    allowNull : true
  }
});

async function syncModels() {
  try {
    await UserLocation.sync({alter : false});
    console.log("UserLocation sync complete ✅");
  } catch (error) {
    console.error("UserLocation sync failed ❌", error);
  }
}

syncModels();

module.exports = UserLocation;
