const { DataTypes } = require('sequelize');
const Admin = require('./Admin.js');
const db = require('../config/db.js');

const Card = db.define(
  "Card",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    cardNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    balance: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cardType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      usedState : {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      state : {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdAt : {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      }
  },

  {
    timestamps: false,
    tableName: "Card",
  }
);


Admin.hasMany(Card)
Card.belongsTo(Admin )

async function syncModels() {
  try {
    await Card.sync({alter: false});
    console.log("Card sync complete ✅");
  } catch (error) {
    console.error("Card sync failed ❌", error);
  }
}

syncModels();

module.exports = Card;
