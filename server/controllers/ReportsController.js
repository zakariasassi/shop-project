const { Op, Sequelize } = require('sequelize');
const db = require('../config/db.js');
const Customers = require('../model/Customer.js');
const Order = require('../model/Order.js');
const Product = require('../model/Product.js');
const OrderItem = require('./../model/OrderItem.js');
const WebsiteVisit = require('../model/WebsiteVisit.js');
const Cart = require('../model/Cart.js');
const WatchedProduct = require('../model/WatchedProudacts.js');



 const  getAllDoneOrders = async  (req , res) => {
    try {
        const orders = await Order.findAll({
            attributes: [
                'status',
                [db.fn('COUNT', db.col('status')), 'count']
            ],
            group: ['status'],
            raw: true
        });

  
      if(orders < 0 ) {
        return res.status(401).json({ message : "Problem while get data"})
      }
      res.status(200).json(orders)
    } catch (error) {
        
      console.log(error);
      res.status(501).json({ error: error.message });

    }
  }

   const  getproductscount = async (req , res) => {
    try {
        const {count} = await Product.findAndCountAll()
        res.json(count)
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: error.message });

    }
  } 

   const  getcustomerscount = async (req , res) => {
    try {
        const {count} = await Customers.findAndCountAll()
        res.json(count)
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: error.message });

    }
  } 

   const  gettotalofsales = async (req , res) => {
    try {
        const data = await Order.findAll({
          where:{
            status : "delivered"
          },
            attributes : ['totalAmount']
        });
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            sum = sum + data[i].totalAmount;

        }

        res.json(sum)
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: error.message });

    }
  } 


   const getTopSellingProducts = async (req, res) => {
    try {
      const { from, to } = req.query;
      
      // Parse and format dates
      const startDate = new Date(from).toISOString().split('T')[0]; // 'YYYY-MM-DD'
      const endDate = new Date(to).toISOString().split('T')[0]; // 'YYYY-MM-DD'
  
      if (isNaN(new Date(startDate).getTime()) || isNaN(new Date(endDate).getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }
  
      const topSellingProducts = await OrderItem.findAll({
        attributes: [
          'ProductId',
          [db.fn('SUM', db.col('quantity')), 'totalQuantity'],
          'Product.id',
          'Product.TradeName',
          'Product.price'
        ],
        where: {
          createdAt: {
            [Sequelize.Op.between]: [startDate, endDate]
          }
        },
        include: [{ model: Product }], // Ensure only necessary attributes from Product
        group: ['OrderItem.ProductId', 'Product.id', 'Product.TradeName', 'Product.price'], // Group by all non-aggregated columns
        order: [[db.fn('SUM', db.col('quantity')), 'DESC']],
        limit: 5,
        logging: console.log // Log the query for debugging
      });
  
      // Check if data was returned
      console.log('Top Selling Products:', topSellingProducts);
  
      res.json(topSellingProducts);
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.error('Error fetching top selling products:', error);
    }
  };
  
   const SalesReport = async (req, res) => { 
    try {
        const { from, to } = req.query;

        // Parse and format dates
        const startDate = new Date(from).toISOString().split('T')[0]; // 'YYYY-MM-DD'
        const endDate = new Date(to).toISOString().split('T')[0]; // 'YYYY-MM-DD'
        
        if (isNaN(new Date(startDate).getTime()) || isNaN(new Date(endDate).getTime())) {
          return res.status(400).json({ error: 'Invalid date format' });
        }
        
        const salesReport = await Order.findAll({
          attributes: [
            'id',
            'customerId',
            'totalAmount',
            'status',
            'createdAt',
          ],
          where: {
            createdAt: {
              [Sequelize.Op.between]: [startDate, endDate]
            },
            status: 'delivered'
          },
          raw: true,
        });

        res.json(salesReport);
        
    } catch (error) {
      console.error('Error fetching sales report:', error);
      res.status(500).json({ error: error.message });
    }
};


 const getUnitsSoldPerProduct = async (req, res) => {
  const { startDate, endDate } = req.query; // Accept date range parameters

  try {
    const report = await OrderItem.findAll({
      attributes: [
        'ProductId',
        [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalUnitsSold']
      ],
      group: ['ProductId', 'Product.id', 'Product.TradeName', 'Product.price'],
      include: [
        {
          model: Product,
          attributes: ['id', 'TradeName', 'price']
        }
      ],
      where: {
        ...(startDate && endDate ? {
          createdAt: {
            [Sequelize.Op.between]: [new Date(startDate), new Date(endDate)]
          }
        } : {})
      }
    });

    const reportData = report.map(item => ({
      ProductId: item.ProductId,
      ProductName: item.Product.TradeName,
      ProductPrice: item.Product.price,
      totalUnitsSold: item.get('totalUnitsSold')
    }));

    res.json(reportData);
  } catch (error) {
    res.status(501).json({ error: error.message });
    console.error('Error generating report:', error);
  }
};

 const OrdersReport = async (req, res) => { 
  try {
      const { from, to, status } = req.query;

      // Parse and format dates
      const startDate = new Date(from).toISOString().split('T')[0]; // 'YYYY-MM-DD'
      const endDate = new Date(to).toISOString().split('T')[0]; // 'YYYY-MM-DD'
      
      if (isNaN(new Date(startDate).getTime()) || isNaN(new Date(endDate).getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      const whereClause = {
          createdAt: {
            [Sequelize.Op.between]: [startDate, endDate]
          }
      };

      if (status) {
          whereClause.status = status;
      }

      const ordersReport = await Order.findAll({
        attributes: [
          'id',
          'customerId',
          'totalAmount',
          'status',
          'createdAt',
        ],
        include: [{
            model: OrderItem, include : [
              {model: Product}
            ]  // Assuming you have a model named `OrderItem`
           
        }],
        where: whereClause,
     
      });

      console.log(ordersReport);

      res.json(ordersReport);
      
  } catch (error) {
    console.error('Error fetching orders report:', error);
    res.status(500).json({ error: error.message });
  }
};


 const RecordVistsReport = async (req, res) => {
  const { fromDate, toDate } = req.query;
  
console.log("from" , fromDate);
console.log("to" , toDate);

  if (!fromDate ||!toDate) {
    return res.status(400).json({ error: 'Invalid date format' });
  }
  
  try {
    const report = await WebsiteVisit.findAll({
      where: {
        visitDate: {
          [Sequelize.Op.between]: [fromDate, toDate],
        },
      },
      order: [['visitDate', 'ASC']],
    });

    res.status(200).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching visit report');
  }
}


 const ValueOfDropingCart = async (req, res) => {

  console.log("flkajfkajfkla");

  const { from, to } = req.query;
  
  if (!from ||!to) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  try {
    const data = await Cart.findAndCountAll({
   
      where: {
        createdAt: {
          [Sequelize.Op.between]: [from, to],
        },
      },
    });


    const allDoneCarts = data.rows.filter((row) => row.state === 'done');
    const allPendingCarts = data.rows.filter((row) => row.state === 'pending');
 
    let value = (allPendingCarts.length / data.count) * 100;
  
  
    res.status(200).json(  { rows: data.rows , value: value});
  }catch(err) {
      console.error(err);
      res.status(500).send('Error fetching droping cart value');
    }
  }


   const getMostVisitedProducts = async (req, res) => {
    const { startDate, endDate } = req.query;
      try {
      const report = await WatchedProduct.findAll({
        attributes: [
          'ProductId',
          [Sequelize.fn('COUNT', Sequelize.col('ProductId')), 'visitCount']
        ],
        group: ['ProductId', 'Product.id', 'Product.TradeName', 'Product.price'],
        include: [
          {
            model: Product,
            attributes: ['id', 'TradeName', 'price']
          }
        ],
        where: {
          ...(startDate && endDate ? {
            createdAT: {
              [Op.between]: [new Date(startDate), new Date(endDate)]
            }
          } : {})
        },
        order: [['visitCount', 'DESC']] // Order by visit count
      });
  
      const reportData = report.map(item => ({
        ProductId: item.ProductId,
        ProductName: item.Product.TradeName,
        ProductPrice: item.Product.price,
        visitCount: item.get('visitCount')
      }));
  
      console.log('Most Visited Products:', reportData);
      res.json(reportData);
    } catch (error) {
      res.status(501).json({ error: error.message });
      console.error('Error generating report:', error);
    }
  };


  module.exports = {
    getproductscount,
    getTopSellingProducts,
    getcustomerscount,
    gettotalofsales,
    SalesReport,
    getUnitsSoldPerProduct,
    OrdersReport,
    RecordVistsReport,
    ValueOfDropingCart,
    getMostVisitedProducts,
    getAllDoneOrders

  };