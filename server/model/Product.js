const { DataTypes } = require('sequelize');
const db = require('../config/db.js');
const MainCategory = require('./MainCategory.js');
const SubCategory = require('./SubCategory.js');
const BrandCategory = require('./BrandCategory.js');
const Offer = require('./Offer.js');
const ProductOffers = require('./ProductOffers.js');  // Fixed the extra space in the filename


const Product = db.define('Products', {
  id:{
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement: true,
        allowNull: false,
    },
    TradeName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prodcutCode: {
    type: DataTypes.INTEGER,
    allowNull: true,

  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  PackageType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Size: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
  shortDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  discountPercentage: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  fullDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
    
  howUse: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  availability: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  delete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  createdAt : {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
    allowNull: true,
  }

},{
    timestamps: false,
    tableName: 'Products',
    charset:'utf-8',
    indexes: [
      {
        fields: ['TradeName'], // Create index for faster searches
      }
    ]
});





Product.belongsTo(MainCategory );
Product.belongsTo(SubCategory);
Product.belongsTo(BrandCategory);





async function syncModels() {
  try {
    await Product.sync({alter:false});
    console.log("Product sync complete ✅");
  } catch (error) {
    console.error("Product sync failed ❌", error);
  }
}



syncModels();



module.exports =  Product;