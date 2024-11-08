const express = require('express');
const CustomerController = require('../controllers/CustomerController.js');
const verify = require('../middleware/verifyToken.js');

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
    const folderPath = `public/uploads/images/customers/userprofile/${uuidv4()}`;
    createFolderIfNotExists(folderPath);
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`); // Rename file to avoid conflicts
  },
});



const upload = multer({ storage: storage });

const router = express.Router();

router.post("/login", CustomerController.loginCustomer);
router.post("/register", CustomerController.createCustomer);
router.get('/all', authenticateToken, CustomerController.getAllCustomers); // New route to get all customers
router.get("/profile", authenticateToken, CustomerController.getProfile);
router.put("/profile", authenticateToken , upload.single("image") , CustomerController.updateProfile);
router.delete("/:id", authenticateToken, CustomerController.deleteCustomer);


router.get('/check', authenticateToken , (req , res ) => {
  res.status(200).json("Authorized")
});

module.exports = router;
