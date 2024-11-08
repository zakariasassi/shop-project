const { DataTypes } = require('sequelize');
const Cart = require('./Cart.js');
const db = require('../config/db.js');
const Product = require('./Product.js');




const CartItem = db.define('CartItem', {
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
    tableName: 'CartItem',
});


CartItem.belongsTo(Cart, { foreignKey: 'cartId' } );
Cart.hasMany(CartItem, { foreignKey: 'cartId' });

CartItem.belongsTo(Product, { foreignKey: 'productId'  } );
Product.hasMany(CartItem, { foreignKey: 'productId'  } );




async function syncModels() {
  try {
    await CartItem.sync({alter : false});
    console.log("CartItem sync complete ✅");
  } catch (error) {
    console.error("CartItem sync failed ❌", error);
  }
}


syncModels();

module.exports = CartItem;
