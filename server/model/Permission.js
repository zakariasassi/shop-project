const { DataTypes } = require('sequelize');
const db = require('../config/db.js');
const Admin = require('./Admin.js');

// Define the Role model
const Role = db.define(
  'Role',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    role_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: true,
    tableName: 'Role',
  }
);

// Define the Permission model
const Permission = db.define(
  'Permission',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    permission_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: true,
    tableName: 'Permission',
  }
);

// Define the RolePermission and AdminRole models
const RolePermission = db.define('RolePermission');
const AdminRole = db.define('AdminRole');

// Define many-to-many relationships
Admin.belongsToMany(Role, { through: AdminRole, foreignKey: 'adminId', as: 'roles'  });
Role.belongsToMany(Admin, { through: AdminRole, foreignKey: 'roleId', as: 'admins' });

Role.belongsToMany(Permission, { through: RolePermission, as: 'Permissions', foreignKey: 'roleId'} );
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permissionId' });

const syncModels = async () => {
  try {
    await Role.sync({ alter: false });
    await Permission.sync({ alter: false });
    await RolePermission.sync({ alter: false });
    await AdminRole.sync({ alter: false });
    console.log('Models synced successfully ✅');
  } catch (error) {
    console.error('Model sync failed ❌', error);
  }
};

syncModels();

// Export the models
module.exports = { Role, Permission, RolePermission, AdminRole };
