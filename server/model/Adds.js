const { DataTypes } = require('sequelize');
const db = require('../config/db.js');


const Adds = db.define('Adds', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    
    },
    image: {
        type: DataTypes.STRING,
    }, 
     createdAt : {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      }
}, {
    timestamps: false,
    tableName: 'Adds',
});

async function syncModels() {
    try {
        await Adds.sync({ alter: false });
        console.log("Adds sync complete ✅");
    } catch (error) {
        console.error("Adds sync failed ❌", error);
    }
}

syncModels();

module.exports =  Adds;
