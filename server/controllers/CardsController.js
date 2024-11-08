const Card = require('../model/Card.js');
const { v4: uuidv4 } = require('uuid');
const Cart = require('../model/Cart.js');








const generateCardNumber = () => {
  const randomPart = Math.floor(Math.random() * 1e6).toString(); // Random number up to 999999
  const timestampPart = Date.now().toString(); // Current timestamp in milliseconds
  return (randomPart + timestampPart).slice(0, 10); // Combine and slice to 10 digits
};








class CardContrller {
// Function to create multiple cards for a user




 async createCards (req, res)  {
  const { id } = req.user; // Assuming userId is available in req.user
  const { numberOfCards, initialBalance } = req.body;

  if (!numberOfCards || !initialBalance) {
    return res.status(400).send('Number of cards and initial balance are required.');
  }

  try {
    const cards = [];
    for (let i = 0; i < numberOfCards; i++) {
      const card = await Card.create({
        AdminId : id,
        //uuidv4()
        cardNumber:generateCardNumber(), // Generate a unique card number
        cardType: 'Virtual', // Assuming it's a virtual card
        expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 3)), // 3 years from now
        balance: initialBalance,
      });
      cards.push(card);
    }

    res.status(201).send(cards);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error.');
  }
};

// Function to get all cards of a user
   async  getUserCards(req, res) {
  const { userId } = req.user; // Assuming userId is available in req.user

  try {
    const cards = await Card.findAll({ where: { userId } });
    res.status(200).send(cards);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error.');
  }
};



async  getAll(req, res) {
  try {
    const page = parseInt(req.query.page) || 1; // الصفحة الحالية (افتراضيًا الصفحة الأولى)
    const limit = parseInt(req.query.limit) || 50; // الحد الأقصى للعناصر في الصفحة (افتراضيًا 50 عنصر)
    const offset = (page - 1) * limit;

    const { count, rows: cards } = await Card.findAndCountAll({
      offset: offset,
      limit: limit,
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      cards: cards,
      currentPage: page,
      totalPages: totalPages,
      nextPage: page < totalPages ? page + 1 : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error.');
  }
}




}


module.exports = new CardContrller
