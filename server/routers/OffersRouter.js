const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Import controller functions
const { 
  getAllOffers, 
  createOffer, 
  updateOffer, 
  deleteOffer, 
  deactivate, 
  activate, 
  getAllOffersAdmin, 
  getOfferProducts 
} = require('../controllers/OfferController.js');
const authenticateToken = require('../middleware/verifyToken.js');


const createFolderIfNotExists = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderPath = `public/uploads/images/offers/${uuidv4()}`;
    createFolderIfNotExists(folderPath);
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage: storage });

const router = express.Router();



router.get('/admin', authenticateToken ,  getAllOffersAdmin);
router.get('/offerproducts',  authenticateToken ,  getOfferProducts);

router.get('/' ,  getAllOffers);
router.post('/',  authenticateToken ,  upload.single('cover'), createOffer);
router.put('/:id',  authenticateToken ,   updateOffer);
router.delete('/:id',  authenticateToken ,  deleteOffer);
router.put('/deactivate/:id',  authenticateToken ,   deactivate);
router.put('/activate/:id',  authenticateToken ,  activate);

module.exports = router;
