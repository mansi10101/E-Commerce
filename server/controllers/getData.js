const ProductModel = require('../models/Product');
const UserModel = require('../models/User');
const CartModel = require('../models/Cart');
const ObjectId = require('mongodb').ObjectId;

const getProsucts = async (req, res) => {
  try {
    const products = await ProductModel.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCartById = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await CartModel.findOne({ user: id })
      .populate({
        path: 'items',
        select: 'product quantity',
        populate: {
          path: 'product',
          select: 'name price quantity',
        },
      })
      .exec();
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const increase_product = async (req, res) => {
  const { id: cartId } = req.params;
  const { productId } = req.body;
  try {
    const cart = await CartModel.findById(cartId);

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    const cartItem = cart.items.find(
      (item) => item.product.toString() === new ObjectId(productId).toString()
    );

    if (cartItem) {
      // If the product exists in the cart, update the quantity
      cartItem.quantity += 1;
      await cart.save();

      res.status(200).json(cartItem);
    } else {
      console.log('Product doesnt exist in cart');
    }
  } catch (err) {
    res.status(403).json({ error: err });
  }
};

const decrease_product = async (req, res) => {
  const { id: cartId } = req.params;
  const { productId } = req.body;
  try {
    const cart = await CartModel.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    const cartItem = cart.items.find(
      (item) => item.product.toString() === new ObjectId(productId).toString()
    );

    if (cartItem) {
      // If the product exists in the cart, update the quantity
      cartItem.quantity -= 1;
      await cart.save();

      res.status(200).json({ cartItem });
    } else {
      console.log('Product doesnt exist in cart');
    }
  } catch (error) {
    res.status(403).json({ error: error });
  }
};

module.exports = {
  getProsucts,
  getCartById,
  increase_product,
  decrease_product,
};
