// routes/couponRoutes.js
const express = require('express');
const { createCoupon, getCoupons, updateCoupon, deleteCoupon, applyCoupon, deactivateCoupon } = require('../controllers/CouponController.js');
const authenticateToken = require('../middleware/verifyToken.js');


const router = express.Router();

router.post('/', authenticateToken ,  createCoupon);
router.get('/',  authenticateToken ,  getCoupons);
router.put('/:id', authenticateToken ,   updateCoupon);
router.delete('/:id', authenticateToken ,  deleteCoupon);
router.post('/apply', authenticateToken ,  applyCoupon);
router.post('/deactivateCoupon', authenticateToken ,  deactivateCoupon);


module.exports =  router
