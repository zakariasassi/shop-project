// routes/MainCategoryRoutes.js
const express = require('express');
const SubCategoryController = require('../controllers/SubCategoryController.js');

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const authenticateToken = require('../middleware/verifyToken.js');


const createFolderIfNotExists = (folder) => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  };
  
  
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const productId = req.params.id; // Assuming you get productId from request params
      const folderPath = `public/uploads/images/subcategory/${uuidv4()}`;
      createFolderIfNotExists(folderPath);
      cb(null, folderPath);
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}${path.extname(file.originalname)}`); // Rename file to avoid conflicts
    }
  });



const upload = multer({ storage: storage });
const router = express.Router();

router.post('/', authenticateToken ,  upload.single('image') , SubCategoryController.create);
router.get('/' , SubCategoryController.getAll);
router.get('/:id', authenticateToken ,SubCategoryController.getById);
router.put('/:id', authenticateToken ,   upload.single('image') ,  SubCategoryController.update);
router.delete('/:id', authenticateToken ,SubCategoryController.delete);

module.exports = router;
