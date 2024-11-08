const { Role, Permission, RolePermission } = require('../model/Permission.js');

// Add a new role
 const addRole = async (req, res) => {
  try {
    const { role_name } = req.body;
    const role = await Role.create({ role_name });
    res.status(201).json(role);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
};

// Get all roles
 const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json(roles);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a role
 const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    await Role.destroy({ where: { id } });
    res.status(204).json();
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
};





 const assignPermissionToRole = async (req, res) => { 
  try {
    const {role_id} = req.params;
    const {  permissionId } = req.body;
    const permission =  await RolePermission.create({
      roleId : role_id,
      permissionId : permissionId,
    }
    )
    if(permission){
      return res.status(200).json({ message: 'Permission assigned successfully' });



    }

    res.status(404).json({ message: 'Permission not found' });

    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};





const getAllRolesAndPermissions = async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: [
        {
          model: Permission,
          as: 'Permissions', // The alias defined in the model
        },
      ],
    });
    res.json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching roles and permissions' });
  }
};







 const addPermission = async (req, res) => {
  try {
    const { permission_name } = req.body;
    const permission = await Permission.create({ permission_name });
    res.status(201).json(permission);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Get all roles
 const getPermission = async (req, res) => {
  try {
    const permission = await Permission.findAll();
    res.status(200).json(permission);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
};

// Delete a role
 const deletePermission = async (req, res) => {
  try {
    const { id } = req.params;
    await Permission.destroy({ where: { id } });
    res.status(204).json();
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
};



module.exports = {
  addRole,
  getRoles,
  deleteRole,
  assignPermissionToRole,
  addPermission,
  getPermission,
  deletePermission,
  getAllRolesAndPermissions
 };