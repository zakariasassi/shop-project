// controllers/couponController.js
const   Coupon  = require('../model/Coupon.js')

 const createCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, expirationDate } = req.body;
    const coupon = await Coupon.create({ code, discountPercentage, expirationDate });
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create coupon' });
  }
};

 const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll();
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coupons' });
  }
};

 const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discountPercentage, expirationDate, isActive } = req.body;
    const coupon = await Coupon.findByPk(id);
    if (coupon) {
      coupon.update({ code, discountPercentage, expirationDate, isActive });
      res.status(200).json(coupon);
    } else {
      res.status(404).json({ error: 'Coupon not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update coupon' });
  }
};

 const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByPk(id);
    if (coupon) {
      await coupon.destroy();
      res.status(200).json({ message: 'Coupon deleted successfully' });
    } else {
      res.status(404).json({ error: 'Coupon not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete coupon' });
  }
};



 const applyCoupon = async (req, res) => {
    const { code, totalPrice } = req.body;
    try {
      const coupon = await Coupon.findOne({ where: { code } });
      if (!coupon) {
        return res.json({ state : false ,  message: 'Coupon not found' });
      }
  
      const discount = coupon.discountPercentage / 100;
      const discountedPrice = totalPrice - (totalPrice * discount);
      
      res.status(200).json({
        newPrice: discountedPrice.toFixed(2),
        coupon: coupon
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Server error' });
    }
  };



   const deactivateCoupon = async (req, res) => {
    const { code } = req.body;
    try {
      const coupon = await Coupon.findOne({ where: { code } });
      if (!coupon) {
        return res.json({ state : false ,  message: 'Coupon not found' });
      }
  
      coupon.isActive = false;
      coupon.save();

      res.status(200).json({message : 'Coupon deactivated successfully'});
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Server error' });
    }
  };



  module.exports = {
    createCoupon,
    getCoupons,
    updateCoupon,
    deleteCoupon,
    applyCoupon,
    deactivateCoupon,
  }