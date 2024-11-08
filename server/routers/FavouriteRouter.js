const express = require('express');
const FavouriteController = require('../controllers/FavouriteController.js');
const verify = require('../middleware/verifyToken.js');
const authenticateToken = require('../middleware/verifyToken.js');


const router = express.Router();


router.get('/', authenticateToken, FavouriteController.getAllUserFavourites);
router.post('/', authenticateToken, FavouriteController.addToList);
router.delete('/:id', authenticateToken, FavouriteController.removeFromList);


module.exports = router;
