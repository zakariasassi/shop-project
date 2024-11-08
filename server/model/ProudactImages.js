const  { DataTypes } = require("sequelize");
const  db = require("../config/db");
const Product = require("./Product");




const ProductImages = db.define('ProductImages' , {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },

    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
    tableName: 'ProductImages',
    
});


Product.hasMany(ProductImages)
ProductImages.belongsTo(Product)


async function syncModels() {
    try {
      await ProductImages.sync({alter:false});
      console.log("ProductImages sync complete ✅");
    } catch (error) {
      console.error("ProductImages sync failed ❌", error);
    }
  }
  
  


  
  syncModels();
  

module.exports = ProductImages;