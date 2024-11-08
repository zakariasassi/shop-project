// controllers/cartController.js
const db = require("../config/db.js");
const Cart = require("../model/Cart.js");
const CartItem = require("../model/CartItem.js");
const DeletedCart = require("../model/DeletedCart.js");
const DeletedCartItems = require("../model/DeletedCartItems.js");
const Product = require("../model/Product.js"); // Adjust the import as per your project structure
const ProudactImages = require("../model/ProudactImages.js"); // Adjust the import as per your project structure


class CartController {
  async addToCart(req, res) {
    const userId = req.user.id;
    const { id } = req.body;

    try {
      let cart = await Cart.findOne({ where: { userId, state: "pending" } });
      if (!cart) {
        cart = await Cart.create({ userId });
      }

      let cartItem = await CartItem.findOne({
        where: { cartId: cart.id, productId: id },
      });
      if (cartItem) {
        cartItem.quantity += 1;
        await cartItem.save();
      } else {
        const product = await Product.findByPk(id);
        await CartItem.create({
          cartId: cart.id,
          productId: id,
          price:
            product.discountPercentage != 0
              ? (
                  product.price -
                  product.price * (product.discountPercentage / 100)
                ).toFixed(0)
              : product.price,
        });
      }

      res.status(200).json({ message: "تمت اضافة منتج الي المفضلة" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }

  async getCart(req, res) {
    const userId = req.user.id;

    try {
      const cart = await Cart.findOne({
        where: { userId, state: "pending" },
        include: [
          {
            model: CartItem,
            include: [{
              model: Product,
              include: [
                {
                  model: ProudactImages,
                }
              ]
            }]
            
            // order: [['createdAt', 'DESC']]  // Order CartItems by quantity in descending order
          },
        ],
        // Assuming 'createdAt' or another timestamp field in CartItem for descending order
      });

      if (!cart) {
        return res.json({ message: "السلة غير موجوة" });
      }

      const cartItems = await CartItem.findAll({
        where: {
          cartId: cart.id,
        },
      });

      const totalPrice = cartItems.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
      );

      console.log(totalPrice);
      res.status(200).json({ cart: cart, total: totalPrice });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }

  async updateQuantity(req, res) {
    const { id } = req.user;
    const { productId, quantity, itemId } = req.body;

    try {
      const cart = await Cart.findOne({
        where: { userId: id, state: "pending" },
      });
      if (!cart) {
        return res.json({ message: "Cart not found" });
      }

      const cartItem = await CartItem.findOne({
        where: { cartId: cart.id, productId: productId, id: itemId },
      });
      if (!cartItem) {
        return res.json({ message: "CartItem not found" });
      }

      cartItem.quantity = quantity;
      await cartItem.save();

      const cartItems = await CartItem.findAll({
        where: {
          cartId: cart.id,
        },
      });

      const totalPrice = cartItems.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
      );

      res
        .status(200)
        .json({
          message: "تم تحديث الكمية",
          totalPrice: totalPrice,
        });
    } catch (error) {
      console.error("Error updating quantity:", error);
      res.status(500).json({ error: "Failed to update quantity" });
    }
  }


  async removeCartItem(req, res, next) {
    const { cartId , productId } = req.query;

    try {

      const cartitem = await CartItem.destroy({
        where: {
          cartId: cartId,
          productId: productId
        },
      
      });


      // const cart = await Cart.findOne({
      //   where: {
      //     id: id,
      //   },
      //   include: [{ model: CartItem }],
      // });

      if (!cartitem) {
        return res.status(404)
      }

      // await deleteCartAndTransferData(cart.id);

      //  const  cartItems = await CartItem.destroy({
      //   where : {
      //     cartId : cart.id
      //   }
      //  })

      // await cart.destroy();
      res.status(200)
    } catch (error) {
      console.error(error);
      res.status(500)
    }
  }
}



async function deleteCartAndTransferData(cartId) {
  const transaction = await db.transaction(); // Start a transaction
  try {
    // Step 1: Fetch the cart and its items
    const cart = await Cart.findByPk(cartId, { include: CartItem });
    if (!cart) {
      throw new Error("Cart not found");
    }

    // Step 2: Transfer Cart data to DeletedCart
    const deletedCart = await DeletedCart.create(
      {
        id: cart.id,
        userId: cart.userId,
        createdAt: cart.createdAt,
      },
      { transaction }
    );

    // Step 3: Transfer CartItems data to DeletedCartItems
    const cartItemsPromises = cart.CartItems.map((item) => {
      return DeletedCartItems.create(
        {
          cartId: deletedCart.id, // Use the new deletedCart ID
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          createdAt: item.createdAt,
        },
        { transaction }
      );
    });

    await Promise.all(cartItemsPromises); // Wait for all items to be copied

    // Step 4: Delete the CartItems from the original CartItems table
    await CartItem.destroy({ where: { cartId: cart.id }, transaction });

    // Step 5: Delete the Cart from the original Cart table
    await Cart.destroy({ where: { id: cart.id }, transaction });

    // Step 6: Commit the transaction if everything went fine
    await transaction.commit();
    console.log("Cart and CartItems successfully transferred and deleted.");
    return
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();
    console.error("Error transferring cart and items:", error);
  }
}

module.exports =  new CartController();
