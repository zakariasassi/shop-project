const express = require('express');
const  UserLocationController  = require('../controllers/UserLocationController.js');
const authenticateToken = require('../middleware/verifyToken.js');

const router = express.Router();



router.post('/' , authenticateToken , UserLocationController.createUserLocation)
router.get('/' , authenticateToken , UserLocationController.getAllUserLocations)







module.exports = router; 