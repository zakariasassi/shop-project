import {Role , Permission} from '../model/Permission '



const authorize = (requiredPermissions) => {
    return async (req, res, next) => {
      const user = await User.findByPk(req.user.id, {
        include: {
          model: Role,
          include: [Permission]
        }
      });
  
      const userPermissions = user.Roles.reduce((acc, role) => {
        role.Permissions.forEach(permission => acc.add(permission.permission_name));
        return acc;
      }, new Set());
  
      const hasPermission = requiredPermissions.every(permission => userPermissions.has(permission));
  
      if (!hasPermission) {
        return res.status(403).json({ message: 'Forbidden' });
      }
  
      next();
    };
  };
  


  export default authorize;
  