const express = require('express');
const CardsController = require('../controllers/CardsController.js');
const verify = require('../middleware/verifyToken.js');
const authenticateToken = require('../middleware/verifyToken.js');

const router = express.Router();


// Route to create multiple cards
router.post('/', authenticateToken, CardsController.createCards);

// Route to get user's cards
router.get('/', authenticateToken, CardsController.getAll);

router.get('/:id', authenticateToken, CardsController.getUserCards);




module.exports = router;