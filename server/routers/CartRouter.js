// routes/cartRoutes.js
const express = require('express');
const CartController = require("../controllers/CartController.js");
const authenticateToken = require('../middleware/verifyToken.js');

const router = express.Router();

router.post('/', authenticateToken, CartController.addToCart);
router.get('/', authenticateToken , CartController.getCart);
router.put('/update-quantity', authenticateToken, CartController.updateQuantity);
router.delete('/remove-item', authenticateToken, CartController.removeCartItem);


module.exports =  router;
