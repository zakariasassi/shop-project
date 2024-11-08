const Cart = require('../model/Cart.js');
const Order = require('../model/Order.js');
const OrderItem = require('../model/OrderItem.js');
const Product = require('../model/Product.js');
const Customers = require('../model/Customer.js');
const TrackOrder = require('../model/TrackOrder.js');
const Coupon = require('../model/Coupon.js');
const Shipping = require('../model/Shipping.js');
const ProductImages = require('../model/ProudactImages.js');



class OrdersController {

  async create(req, res) {
    try {
      const id = req.user.id;

      const { items, cartId, paymentMethod, total, shippingInfo, couponCode } = req.body;
      console.log(req.body);
  
      if (paymentMethod === "wallet") {
        const wallet = await Customers.findByPk(id);
        if (wallet.walletBalance < total) {
          return res.json({ state: false, message: "Wallet Balance is out of range for this order " + JSON.stringify(wallet.walletBalance) });
        }
        wallet.walletBalance = wallet.walletBalance - total;
        wallet.save();
      }
  
      let attempts = 3; // Set retry limit for deadlock
  
      while (attempts > 0) {
        const transaction = await Order.sequelize.transaction();
        try {
          if (!items || items.length === 0) {
            throw new Error('No items in the order');
          }
  
          // Calculate total amount
          let totalAmount = 0;
          for (const item of items) {
            const product = await Product.findByPk(item.productId);
            if (!product) {
              throw new Error(`Product with ID ${item.productId} not found`);
            }
            totalAmount += product.price * item.quantity;
          }
  
          // Create the order
          const newOrder = await Order.create({
            paymentMethod: paymentMethod,
            customerId: id,
            totalAmount : total,
          }, { transaction });


          shippingInfo.OrderId = newOrder.id;
          const shpingDatieils = await Shipping.create(shippingInfo, { transaction });

          if(!shpingDatieils){
            return res.status(501)

          }
  
          for (const item of items) {
            await OrderItem.create({
              OrderId: newOrder.id,
              ProductId: item.productId,
              quantity: item.quantity,
              price: item.price,
            }, { transaction });
          }
  
          // Update the cart state to 'done'
          await Cart.update({ state: 'done' }, {
            where: { id: cartId },
            transaction
          });
  
          // Update the coupon
          await Coupon.update(
            { isActive: false },
            { where: { code: couponCode }, transaction }
          );
  
          await transaction.commit();
          return res.status(201).json(newOrder);
        } catch (error) {
          await transaction.rollback();
          
          if (error.original && error.original.code === '40P01') {
            // Handle deadlock
            attempts -= 1;
            console.log(`Deadlock occurred, retrying... Attempts left: ${attempts}`);
            if (attempts === 0) throw new Error('Transaction failed after retries due to deadlock.');
          } else {
            throw error;
          }
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error.message });
    }
  }
async getAll(req, res) {
  const { page = 1, limit  } = req.query; // Default to page 1 and limit 10
  const offset = (page - 1) * limit;

  try {
    const { rows: orders, count: totalOrders } = await Order.findAndCountAll({
      include: [{
        model: OrderItem,
        include: [Product],
      }, {
        model: Customers
      },
      {model : Shipping}
    ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']], // Ordering by createdDate in descending order

    });

    res.status(200).json({ orders, totalOrders, totalPages: Math.ceil(totalOrders / limit), currentPage: page });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

  async getById(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id, {
        include: [{
          model: OrderItem,
          include: [Product],
        }],
      });
      if (order) {
        res.status(200).json(order);
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }
  async  getAllUserOrders(req, res) {
    try {
      const userId = req.user.id;

      const orders = await Order.findAll({
        where: { customerId: userId }, // Correct column name here
        include: [{
          model: OrderItem,
          include: [
            {model : Product , include : [
              {model : ProductImages}
            ]}
          ],
        }],
        order: [['createdAt', 'DESC']], // Ordering by createdDate in descending order

      });

      if (orders.length > 0) {
        res.status(200).json(orders);
      } else {
        res.json([]);
      }
    } catch (error) {
      console.log( error.message); // Log the error message
      res.status(501).json({ error: error.message });
    }
  }
  
  async update(req, res) {
    const transaction = await Order.sequelize.transaction();
    try {
      const { id } = req.params;
      const { customerId, items, status } = req.body;

      // Update the order
      const order = await Order.findByPk(id);
      if (!order) {
        throw new Error('Order not found');
      }
      await order.update({
        customerId,
        status,
      }, { transaction });

      // Delete existing order items
      await OrderItem.destroy({ where: { orderId: id }, transaction });

      // Recalculate total amount
      let totalAmount = 0;
      for (const item of items) {
        const product = await Product.findByPk(item.productId);
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }
        totalAmount += product.price * item.quantity;
      }

      // Create new order items
      for (const item of items) {
        await OrderItem.create({
          orderId: id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        }, { transaction });
      }

      await order.update({ totalAmount }, { transaction });

      await transaction.commit();
      res.status(200).json(order);
    } catch (error) {
      await transaction.rollback();
      res.status(400).json({ error: error.message });
    }
  }
   async changeStatus(req, res) {
    try {
      const { value, orderID } = req.body;


      const track = await TrackOrder.create({
        AdminId : req.user.id,
        state : value,
        OrderId : orderID
    })  
    if(!track){
      return  res.status(400);

    }


      const state = await Order.update(
        { status: value },
        { where: { id: orderID } }
      );

      if (state) {
        res.status(200).json({ message: 'Order state changed successfully' });
      } else {
        res.status(404).json({ message: 'Problem while changing order state' });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }





  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Order.destroy({ where: { id } });
      if (deleted) {
        res.status(200).json({ message: 'Order deleted successfully' });
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

}

module.exports = new OrdersController();