const express = require('express');
const OrdersController = require('../controllers/OrdersController.js');
const authenticateToken = require('../middleware/verifyToken.js');


const router = express.Router();

router.post('/',  authenticateToken, OrdersController.create);
router.get('/',   authenticateToken, OrdersController.getAll);
router.get('/:id',   authenticateToken, OrdersController.getById);
router.put('/:id',   authenticateToken, OrdersController.update);
router.delete('/:id',   authenticateToken, OrdersController.delete);
router.post('/changestatus',   authenticateToken, OrdersController.changeStatus);
router.get('/user/userorders',    authenticateToken , OrdersController.getAllUserOrders);

module.exports = router;
