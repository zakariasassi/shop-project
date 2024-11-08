const express = require('express');

// Import controller functions
const {
  getAllDoneOrders,
  getproductscount,
  getcustomerscount,
  gettotalofsales,
  getTopSellingProducts,
  SalesReport,
  OrdersReport,
  RecordVistsReport,
  ValueOfDropingCart,
  getUnitsSoldPerProduct,
  getMostVisitedProducts,
} = require('../controllers/ReportsController.js');
const authenticateToken = require('../middleware/verifyToken.js');




const router = express.Router();



router.get('/getalldoneorders' ,authenticateToken ,  getAllDoneOrders)
router.get('/getproductscount' ,authenticateToken ,  getproductscount)
router.get('/getcustomerscount' , authenticateToken , getcustomerscount)
router.get('/gettotalofsales' ,authenticateToken ,  gettotalofsales)
router.get('/gettopsellingproducts' ,authenticateToken ,  getTopSellingProducts)
router.get('/salesreport' ,authenticateToken ,  SalesReport)
router.get('/ordersreport' ,authenticateToken ,   OrdersReport)
router.get('/RecordVistsReport' ,authenticateToken ,   RecordVistsReport)
router.get('/ValueOfDropingCart' ,authenticateToken ,  ValueOfDropingCart)
router.get('/getUnitsSoldPerProduct' ,authenticateToken ,  getUnitsSoldPerProduct)
router.get('/mostVisitedProducts' ,authenticateToken ,  getMostVisitedProducts)





module.exports = router; 