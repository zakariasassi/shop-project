const express = require('express');
const {
  addRole,
  getRoles,
  deleteRole,
  getPermission,
  addPermission,
  assignPermissionToRole,
  deletePermission,
  getAllRolesAndPermissions
} = require('../controllers/RoleController.js');
const authenticateToken = require('../middleware/verifyToken.js');


const router = express.Router();

router.post('/', authenticateToken ,  addRole);
router.get('/',  authenticateToken , getRoles);
router.delete('/:id', authenticateToken , deleteRole);


router.post('/:role_id/permission',  authenticateToken ,assignPermissionToRole);


router.post('/permission', authenticateToken , addPermission);
router.get('/permission', authenticateToken , getPermission);
router.delete('/permission/:id', authenticateToken , deletePermission);
router.get('/getAllRolesAndPermissions' , authenticateToken , getAllRolesAndPermissions)

module.exports = router;
