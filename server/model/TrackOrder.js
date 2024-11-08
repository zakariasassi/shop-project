const { DataTypes } = require('sequelize');
const db = require('../config/db.js');
const Order = require('./Order.js');
const Admin = require('./Admin.js');



const TrackOrder = db.define('TrackOrder', {
    id:{
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement: true,
        allowNull: false,
    },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt : {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  }

},{
    timestamps: false,
    tableName: 'TrackOrder',
});


Order.hasMany(TrackOrder  , {
  foreignKey : {
    allowNull : true
  }
});
TrackOrder.belongsTo(Admin , {
  foreignKey : {
    allowNull : true
  }
})

async function syncModels() {
  try {
    await TrackOrder.sync({alter : false});
    console.log("TrackOrder sync complete ✅");
  } catch (error) {
    console.error("TrackOrder sync failed ❌", error);
  }
}

syncModels();

module.exports = TrackOrder;
