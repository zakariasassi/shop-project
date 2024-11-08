const { DataTypes } = require('sequelize');
const db = require('../config/db.js');
const SubCategory = require('./SubCategory.js');


const BrandCategory = db.define('BrandCategory', {
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
    type: DataTypes.TEXT,
    allowNull: true,
  },
  createdAt : {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  }
},{
  charset: 'utf8',
    timestamps: false,
    tableName: 'BrandCategory',
});

BrandCategory.belongsTo(SubCategory);
  SubCategory.hasMany(BrandCategory );


  async function syncModels() {
    try {
      await BrandCategory.sync({alter : false});
      console.log("BrandCategory sync complete ✅");
    } catch (error) {
      console.error("BrandCategory sync failed ❌", error);
    }
  }
  
  syncModels();

module.exports = BrandCategory;
