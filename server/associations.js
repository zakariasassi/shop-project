// import Order from './model/Order.js';
// import OrderItem from './model/OrderItem.js';
// import Product from './model/Product.js';

// Order.hasMany(OrderItem, { foreignKey: 'orderId' });
// OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

// OrderItem.belongsTo(Product, { foreignKey: 'productId' });

// export default function associateModels() {
//   Order.hasMany(OrderItem, { foreignKey: 'orderId' });
//   OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

//   OrderItem.belongsTo(Product, { foreignKey: 'productId' });
// }


const Offer = require('./model/Offer.js');
const Product = require('./model/Product.js');
const ProductOffers = require('./model/ProductOffers.js');
const Favourite = require('./model/Favourite.js');

Offer.belongsToMany(Product, { through: ProductOffers, foreignKey: 'OfferId' ,   
    onDelete: 'CASCADE',  // Cascade delete when an order is deleted
    onUpdate: 'CASCADE'   // Cascade update when an order ID is updated
  
  } );
Product.belongsToMany(Offer, { through: ProductOffers, foreignKey: 'ProductId' ,    
    onDelete: 'CASCADE',  // Cascade delete when an order is deleted
    onUpdate: 'CASCADE'   // Cascade update when an order ID is updated
  
   });

