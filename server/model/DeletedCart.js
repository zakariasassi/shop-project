const { DataTypes } = require('sequelize');
const db = require('../config/db.js');


const DeletedCart = db.define('DeletedCart', {
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
    tableName: 'DeletedCart',
});

async function syncModels() {
    try {
        await DeletedCart.sync({ alter: false });
        console.log("DeletedCart sync complete ✅");
    } catch (error) {
        console.error("DeletedCart sync failed ❌", error);
    }
}

syncModels();

module.exports = DeletedCart;
