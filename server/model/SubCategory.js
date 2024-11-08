const { DataTypes } = require('sequelize');
const db = require('../config/db.js');
const MainCategory = require('./MainCategory.js');

const SubCategory = db.define(
  "SubCategory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt : {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    }
  },
  {
    timestamps: false,
    tableName: "SubCategory",
  }
);
SubCategory.belongsTo(MainCategory);
MainCategory.hasMany(SubCategory);
async function syncModels() {
  try {
    await SubCategory.sync({alter : false});
    console.log("SubCategory sync complete ✅");
  } catch (error) {
    console.error("SubCategory sync failed ❌", error);
  }
}




syncModels();

module.exports = SubCategory;
