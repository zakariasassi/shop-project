const express = require('express');
const WalletController = require('../controllers/WalletController.js');
const authenticateToken = require('../middleware/verifyToken.js');

const router = express.Router();

router.get('/balance', authenticateToken, WalletController.getBalance);
router.post('/charge', authenticateToken, WalletController.chargeWallet);


module.exports =  router;