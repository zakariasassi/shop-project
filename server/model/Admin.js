// models/Admin.js
const { DataTypes } = require('sequelize');
const db = require('../config/db.js');


const Admin = db.define('Admins', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type : DataTypes.BOOLEAN,
    allowNull : false,
    defaultValue : true
  },

  loginNum: {
    type : DataTypes.INTEGER,
    allowNull : true,
    defaultValue: 0

  },
  createdAt : {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  }

}, {
  timestamps: false,
  tableName: "Admins",
});

// Define self-referencing associations with aliases
Admin.hasMany(Admin, { as: 'SubAdmins', foreignKey: 'createdBy'});
Admin.belongsTo(Admin, { as: 'Creator', foreignKey: 'createdBy' });

async function syncModels() {
  try {
    await Admin.sync({ alter: false });
    console.log("Admin sync complete ✅");
  } catch (error) {
    console.error("Admin sync failed ❌", error);
  }
}

syncModels();

module.exports = Admin;
