const Customers = require('../model/Customer.js');
const Card = require('../model/Card.js');





class WalletController {
  async getBalance(req, res) {
    try {
      const customerId = req.user.id;
      console.log(customerId);
      const customer = await Customers.findByPk(customerId);
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      res.status(200).json({ balance: customer.walletBalance });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  async chargeWallet(req, res) {
    try {
      const { walletAmount } = req.body;

      const customerId = req.user.id;
      const card = await Card.findOne({
        where : {
            cardNumber : walletAmount
        }
      })
      if(!card){
        return res.status(404).json({ message: 'Card not available' });
      }
      if(card.state === false ){
        return res.status(404).json({ message: 'Card code is not valid' });

      }
      const customer = await Customers.findByPk(customerId);
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      customer.walletBalance += parseFloat(card.balance);
      card.state = false;
      await card.save();
      await customer.save();
      res.status(200).json({ balance: customer.walletBalance });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new WalletController();