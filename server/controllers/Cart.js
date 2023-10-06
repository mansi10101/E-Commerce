const UserModel = require('../models/User');
const ProductModel = require('../models/Product');
const OrderModel = require('../models/Order');
const CartModel = require('../models/Cart');
const DiscountCodeModel = require('../models/DiscountCode');
const ObjectId = require('mongodb').ObjectId;

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    // Check if the user's cart already exists or create a new one
    let cart = await CartModel.findOne({ user: userId });

    if (!cart) {
      cart = await CartModel.create({ user: userId, items: [] });
    }

    // Check if the product is already in the cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === new ObjectId(productId).toString()
    );

    if (existingItem) {
      // If the product exists in the cart, update the quantity
      existingItem.quantity += quantity;
    } else {
      // Otherwise, add a new item to the cart
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.json({ cart, message: 'Item added to cart successfully' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Remove item from the cart
const deleteItemFromCart = async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    const cart = await CartModel.findById(cartId);

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Find the index of the product in the cart items array
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === new ObjectId(productId).toString()
    );

    if (itemIndex !== -1) {
      // Remove the item from the cart if found
      cart.items.splice(itemIndex, 1);
      await cart.save();
      res.json({ message: 'Item removed from cart successfully' });
    } else {
      res.status(404).json({ error: 'Item not found in the cart' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};

module.exports = {
  addToCart,
  deleteItemFromCart,
};
