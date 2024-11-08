// routes/MainCategoryRoutes.js
const express = require('express');
const ProducatController = require('../controllers/ProducatController.js');
const verify = require('../middleware/verifyToken.js');
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
      const productId = req.params.id; // Assuming you get productId from request params
      const folderPath = `public/uploads/images/products/${uuidv4()}`;
      createFolderIfNotExists(folderPath);
      cb(null, folderPath);
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}${path.extname(file.originalname)}`); // Rename file to avoid conflicts
    }
  });
  const upload = multer({ storage: storage });


router.post('/',  authenticateToken , upload.array('images', 10) ,  ProducatController.create);
router.get('/' , authenticateToken ,  ProducatController.getAll);
router.get('/to-store'   , ProducatController.getAllToStore);

router.get('/lastproducts'   ,  ProducatController.getLastProducts);

router.get('/:id',  authenticateToken ,ProducatController.getById);
router.put('/:id',  authenticateToken , upload.array('images', 10) , ProducatController.update);
router.delete('/:id', authenticateToken ,  ProducatController.delete);
router.get('/brand/getallbybrandid' ,authenticateToken ,  ProducatController.getAllByBrandID);
router.get('/main/getallproudactbymaincategory' ,authenticateToken ,  ProducatController.getAllByMainCategoryID);



router.get('/statics/count',authenticateToken ,   ProducatController.getProudactCount);

router.post('/discount', authenticateToken ,   ProducatController.discount);



router.put('/state/:id', authenticateToken ,  ProducatController.state);

router.post('/searchproduct' ,authenticateToken ,  ProducatController.searchProduct)
router.post('/new-proudact-watched' , authenticateToken , ProducatController.newProductWatched)

module.exports = router;
