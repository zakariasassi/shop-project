const { DataTypes } = require('sequelize');
const  db = require('../config/db.js');

const MainCategory = db.define('MainCategory', {
    id:{
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement: true,
        allowNull: false,
    },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image:{
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
    tableName: 'MainCategory',
});


async function syncModels() {
  try {
    await MainCategory.sync({alter : false});
    console.log("MainCategory sync complete ✅");
  } catch (error) {
    console.error("MainCategory sync failed ❌", error);
  }
}

syncModels();

module.exports = MainCategory;
