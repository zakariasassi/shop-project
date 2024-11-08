// routes/MainCategoryRoutes.js
const express = require('express');
const MainCategoryController = require('../controllers/MainCategoryController.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const authenticateToken = require('../middleware/verifyToken.js');


const router = express.Router();



const createFolderIfNotExists = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderPath = `public/uploads/images/mainCategorys/${uuidv4()}`;
    createFolderIfNotExists(folderPath);
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });




router.post('/', authenticateToken ,  upload.single('image') , MainCategoryController.create);
router.get('/' , MainCategoryController.getAll);
router.get('/:id', authenticateToken , MainCategoryController.getById);
router.put('/:id', authenticateToken ,   upload.single('image') , MainCategoryController.update);
router.delete('/:id', authenticateToken , MainCategoryController.delete);

module.exports = router;
