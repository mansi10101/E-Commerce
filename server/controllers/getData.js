const ProductModel = require('../models/Product');
const UserModel = require('../models/User');
const CartModel = require('../models/Cart');

const getProsucts = async (req, res) => {
  try {
    const products = await ProductModel.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCartById = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await CartModel.findById(id);
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getProsucts,
  getUsers,
  getCartById,
};
