const { DataTypes } = require('sequelize');
const db = require('../config/db.js');


const Cart = db.define('Cart', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
    },
    createdAt : {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      }
}, {
    timestamps: false,
    tableName: 'Cart',
});

async function syncModels() {
    try {
        await Cart.sync({ alter: false });
        console.log("Cart sync complete ✅");
    } catch (error) {
        console.error("Cart sync failed ❌", error);
    }
}

syncModels();

module.exports  = Cart
