const OrderModel = require('../models/Order');
const UserModel = require('../models/User');
const DiscountCodeModel = require('../models/DiscountCode');
const CartModel = require('../models/Cart');

const checkDiscount = async (req, res) => {
  const { userId, cartId } = req.body;

  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const userOrderCount = user.orderCount;

  // Check if the user's order count meets the nthOrderRequirement for the discount
  let applyDiscount = false;
  let discountAmount = 0;

  const discountCode = req.body.discountCode;

  const discount = await DiscountCodeModel.findOne({ code: discountCode });
  if (discount) {
    if (userOrderCount + 1 === discount.nthOrderRequirement) {
      // User's order count meets the nthOrderRequirement, apply the discount
      applyDiscount = true;
      if (discount.discountType === 'percentage') {
        discountAmount = discount.discountAmount / 100;
      } else if (discount.discountType === 'fixed') {
        discountAmount = discount.discountAmount;
      }
    }
  }

  if (applyDiscount) {
    // Calculate the order total based on the items in the cart
    const cart = await CartModel.findById(cartId).populate('items.product');
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    let orderTotal = 0;
    for (const item of cart.items) {
      orderTotal += item.product.price * item.quantity;
    }

    orderTotal -= orderTotal * discountAmount;
    res.status(200).json({ orderTotal, discountAmount });
  } else {
    res.status(500).json({
      error: `Discount is only valid for ${discount.nthOrderRequirement}th order.`,
    });
  }
};

const checkout = async (req, res) => {
  try {
    const { userId, cartId, discountAmount } = req.body;

    // Retrieve the user's order count
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Calculate the order total based on the items in the cart
    const cart = await CartModel.findById(cartId).populate('items.product');
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    let orderTotal = 0;
    for (const item of cart.items) {
      orderTotal += item.product.price * item.quantity;
    }

    orderTotal -= orderTotal * discountAmount;

    // Create a new order document
    const order = await OrderModel.create({
      user: userId,
      items: cart.items,
      total: orderTotal,
    });

    // Increment the user's order count
    user.orderCount += 1;
    await user.save();

    await CartModel.findByIdAndDelete(cartId);
    res.json({ message: 'Order placed successfully', orderId: order._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};

module.exports = {
  checkout,
  checkDiscount,
};
