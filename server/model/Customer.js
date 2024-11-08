// models/User.js
const { DataTypes }  =  require("sequelize");
const db  =  require("../config/db.js");

const Customers = db.define('Customers', {
    id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true,
    },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,

  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,

  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  state : {
    type : DataTypes.BOOLEAN,
    allowNull : false,
    defaultValue : true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  walletBalance: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  createdAt : {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  }
}, {
  timestamps: false,
  tableName: "Customers",

});

async function syncModels() {
  try {
    await Customers.sync({alter: false});
    console.log("Customers sync complete ✅");
  } catch (error) {
    console.error("Customers sync failed ❌", error);
  }
}



syncModels();


module.exports = Customers
