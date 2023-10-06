const UserModel = require('../models/User');
const ProductModel = require('../models/Product');
const OrderModel = require('../models/Order');
const CartModel = require('../models/Cart');
const DiscountCodeModel = require('../models/DiscountCode');

const getProsucts = async (req, res) => {
  try {
    const products = await ProductModel.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getProsucts,
};
