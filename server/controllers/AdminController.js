const Admin = require('../model/Admin.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');
const { Role, AdminRole, Permission, RolePermission } = require('../model/Permission.js');
const deleteImages = require('../utils/deleteImage.js');
const logger = require('../logger.js');
const { Op } = require('sequelize');
dotenv.config();




      
function normalizePath(winPath) {
  return winPath.split(path.sep).join(path.posix.sep);
}



class UserController {


  
  async updateAdmin(req, res) {
    try {
      const { id } = req.params;
      const { username, fullName, phone, email } = req.body;
  


      // Find the existing admin by ID
      const admin = await Admin.findByPk(id);
  
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
  
      // Check if the email already exists for another user
      const emailExists = await Admin.findOne({
        where: {
          email : email.toLowerCase(),
          id: { [Op.ne]: id },  // Exclude the current user from the check
        },
      });
  
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
  
      // Handle image update logic
      let image = admin.image;  // Keep the old image by default
  
      // Check if a new file was uploaded
      if (req.file) {
        // Delete the old image if a new one is uploaded
        if (admin.image) {
          const imageDeleted = deleteImages('public/uploads/images/admins/userprofile/', admin.image);
          if (!imageDeleted) {
            return res.status(500).json({ message: 'Failed to delete old image from server' });
          }
        }
        // Normalize the new file path
        image = normalizePath(req.file.path).replace('public/uploads/images/admins/userprofile/', '');
      }
  
      // Update the admin with the new data
      const [updated] = await Admin.update({ username : username.toLowerCase(), fullName, phone, email: email.toLowerCase(), image }, { where: { id } });
  
      if (updated) {
        const updatedUser = await Admin.findByPk(id);
        return res.status(200).json(updatedUser);
      } else {
        return res.status(404).json({ message: 'Admin not found' });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error.message });
    }
  }
  
  async createAdmin(req, res) {
    try {
      const userID = req.user.id;
      const { username, fullName, phone, email, password } = req.body;
      let image = null;
  
      if (req.file) {
        image = normalizePath(req.file.path).replace('public/uploads/images/admins/userprofile/', '');
      }
  
      // Check if the email already exists
      const existingUser = await Admin.findOne({ where: { username } });
  
      if (existingUser) {
        return res.status(400).json({ message: 'Admin already exists' });
      }
  
      if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = await Admin.create({
        username,
        fullName,
        image,
        phone,
        email,
        password: hashedPassword,
        createdBy: userID
      });
  
      if (newUser) {
        logger.info('Created new admin');
        res.status(201).json(newUser);
      } else {
        logger.error('Problem while creating new admin');
        res.status(400).json({ message: 'Failed to create admin' });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }

  // Admin login
  async  loginAdmin(req, res) {
    try {

 
      const { username, password } = req.body;

      const checkFirstAdmin = await Admin.findAndCountAll();

      if(checkFirstAdmin.count == 0) {
        console.log(checkFirstAdmin);
        const hashedPassword = await bcrypt.hash("1234567890", 10);

        const newUser = await Admin.create({
          username : "admin",
          fullName : "admin",
          image : "",
          phone: "0924167849",  
          email : "admin@libocare.com",
          password: hashedPassword,
          createdBy : null
        });

        const assuming =   await AdminRole.create({
          adminId: newUser.id,
          roleId: 1
        });
          return res.status(200);
 
      }
      // if(!username) { return res.status(401).json({ message:"يجب ادخال اسم المستخدم"})}
      // if(!password) { return res.status(401).json({ message:"يجب ادخال كلمة االمرور "})}

      // Find the user with associated roles and permissions
      const user = await Admin.findOne({
        where: { username },
        include: [
          {
            model: Role,
            as: 'roles',
            include: [
              {
                model: Permission,
                as: 'Permissions', // Ensure this alias matches with the Role model
              },
            ],
          },
        ],
      });
  
      if (!user) {
        return res.status(404).json({ message: 'اسم المستخدم غير موجود' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'كلمة المرور غير صحيحة' });
      }
  
      const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, { expiresIn: '12h' });
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
      });
  
      const userdata = {
        name: user.username,
        image: user.image,
        fullName: user.fullName,
      };
  
      // Extract roles and permissions
      const userRoles = user.roles.map(role => ({
        id: role.id,
        role_name: role.role_name,
        permissions: role.Permissions.map(permission => permission.permission_name),
      }));


     // logger.info('new admin logedin ')
  
      res.status(200).json({ user: userdata, token, roles: userRoles });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }

  }

  // Get all admin users
  async getAllAdmin(req, res) {
    try {
      const users = await Admin.findAll({
        include: [
          { model: Admin, as: 'Creator' }    // Include the creator
        ]
      });
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }

  // Get a single admin user by ID
  async getAdmin(req, res) {
    try {
      const { id } = req.params;
      const user = await Admin.findByPk(id);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'الادمن غير موجود' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update an admin user

  

  // Delete an admin user
  async deleteAdmin(req, res) {
    try {
      const { id } = req.params;



      const deleted = await Admin.destroy({
        where: { id },
      });

      if (deleted) {
        res.status(200).json({ message: 'تم الحدف بنجاح' });
      } else {
        res.status(404).json({ message: 'المستخدم غير موجود' });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }

async assignRoleToAdmin(req, res) {
  try {
    const { id } = req.params; // Admin ID
    const { roleId } = req.body;


    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    const role = await Role.findByPk(roleId);
    if (!role) {
      return res.status(404).json({ message: 'الصلاجية غير موجودة' });
    }

    // Assuming there's a relation between Admin and Role, like a many-to-many relation
  const assuming =   await AdminRole.create({
      adminId: id,
      roleId: roleId
    });


    res.status(200).json({ message: 'تم اضافة الصلاجية بنجاح' });
  } catch (error) {
    console.error('Error assigning role:', error);
    res.status(400).json({ error: error.message });
  }
}



// In your AdminController.js
async removeRoleFromAdmin(req, res) {
  try {
    const { id } = req.params; // Admin ID
    const { roleId } = req.body;

    // Remove the role from the admin
    await AdminRole.destroy({
      where: {
        adminId: id,
        roleId: roleId
      }
    });

    res.status(200).json({ message: 'تم الغاء الصلاحية ' });
  } catch (error) {
    console.error('Error removing role from admin:', error);
    res.status(400).json({ error: error.message });
  }
}


async getAdminRoles(req, res) {
  try {
    const { id } = req.params; // Admin ID

    // Fetch admin with associated roles
    const admin = await Admin.findByPk(id, {
      include: [
        {
          model: Role,
          as: 'roles' // The alias used in the Admin model association
        }
      ]
    });

    if (!admin) {
      return res.status(404).json({ message: 'تم حدف الصلاحية' });
    }

    // Return roles associated with this admin
    const roles = admin.roles; // Roles associated with this admin

    res.status(200).json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(400).json({ error: error.message });
  }
}

async bloackUser(req , res ) {
  try {
    const { id } = req.query;

    const blockUser = await Admin.update({ state : false }, {
      where: { id },
    });

    if(!blockUser) {
        return res.status(404).json({ message: 'Error updating block user' });

    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}


async unBloackUser(req , res ) {
  try {
    const { id } = req.query;

    const unBloackUser = await Admin.update({ state : true }, {
      where: { id },
    });

    if(!unBloackUser) {
        return res.status(404).json({ message: 'Error updating unBlock user' });

    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}



}

module.exports = new UserController();