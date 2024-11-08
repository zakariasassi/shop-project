const express = require('express');
const AdminController = require('../controllers/AdminController.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const verify = require('../middleware/verifyToken.js');
const authenticateToken = require('../middleware/verifyToken.js');


const createFolderIfNotExists = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderPath = `public/uploads/images/admins/userprofile/${uuidv4()}`;
    createFolderIfNotExists(folderPath);
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`); // Rename file to avoid conflicts
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post('/login', AdminController.loginAdmin);
router.get('/', authenticateToken ,  AdminController.getAllAdmin);
router.get('/:id', authenticateToken ,  AdminController.getAdmin);
router.delete('/:id', authenticateToken ,  AdminController.deleteAdmin);
router.get('/admin/block', authenticateToken ,  AdminController.bloackUser);
router.get('/admin/unblock', authenticateToken ,  AdminController.unBloackUser);

router.post('/:id/assign-role', authenticateToken, AdminController.assignRoleToAdmin);
router.post('/:id/remove-role', authenticateToken, AdminController.removeRoleFromAdmin);

router.get('/:id/roles', authenticateToken, AdminController.getAdminRoles);


router.post('/', authenticateToken, upload.single('image'), AdminController.createAdmin);
router.put('/:id', authenticateToken, upload.single('image'), AdminController.updateAdmin);

router.get('/token/check', authenticateToken , (req , res ) => {
  res.status(200).json("Authorized")
});


module.exports = router;