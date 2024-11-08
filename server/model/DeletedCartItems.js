const { DataTypes } = require('sequelize');
const Cart = require('./Cart.js');
const db = require('../config/db.js');
const Product = require('./Product.js');
const DeletedCart = require('./DeletedCart.js');


const DeletedCartItems = db.define('DeletedCartItems', {
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      createdAt : {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      }
},{
    timestamps: false,
    tableName: 'DeletedCartItems',
});


DeletedCartItems.belongsTo(DeletedCart, { foreignKey: 'cartId'  });
DeletedCart.hasMany(DeletedCartItems, { foreignKey: 'cartId' } );

DeletedCartItems.belongsTo(Product, { foreignKey: 'productId'  } );
Product.hasMany(DeletedCartItems, { foreignKey: 'productId'  } );




async function syncModels() {
  try {
    await DeletedCartItems.sync({alter : false});
    console.log("DeletedCartItems sync complete ✅");
  } catch (error) {
    console.error("DeletedCartItems sync failed ❌", error);
  }
}


syncModels();



module.exports = DeletedCartItems;
