const  { DataTypes } =  require('sequelize');
const  db =  require('../config/db.js');

const ProductOffers = db.define('ProductOffers', {
    OfferId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'offer', // Using table name instead of model reference to avoid circular dependency
            key: 'id'
        }
    },
    ProductId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'products', // Using table name instead of model reference to avoid circular dependency
            key: 'id'
        }
    },
    createdAt : {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    }
});

async function syncModels() {
  try {
    await ProductOffers.sync({alter: false});
    console.log("ProductOffers sync complete ✅");
  } catch (error) {
    console.error("ProductOffers sync failed ❌", error);
  }
}

syncModels();

module.exports = ProductOffers;
