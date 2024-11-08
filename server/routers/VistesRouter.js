const express = require('express');
const  newVisit  = require('../controllers/VisterController.js');

const router = express.Router();



router.post('/newVisiter' , newVisit)







module.exports = router; 