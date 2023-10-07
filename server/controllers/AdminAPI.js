const DiscountCodeModel = require('../models/DiscountCode'); // Create a DiscountCode model using Mongoose
const OrderModel = require('../models/Order');
// Generate a discount code
const generateDiscount = async (req, res) => {
  try {
    const { discountType, discountAmount, nthOrderRequirement } = req.body;

    // Create a new discount code document
    const discountCode = await DiscountCodeModel.create({
      code: generateUniqueDiscountCode(6),
      discountType,
      discountAmount,
      nthOrderRequirement,
    });

    // Save the discount code to the database

    res.json({
      message: 'Discount code generated successfully',
      code: discountCode.code,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};

function generateUniqueDiscountCode(length) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    code += charset.charAt(randomIndex);
  }

  return code;
}

const summary = async (req, res) => {
  try {
    // Calculate the total count of items purchased
    const itemCount = await OrderModel.countDocuments();
    const totalItemsSold = await OrderModel.aggregate([
      {
        $group: {
          _id: null,
          quantity: { $sum: '$total' },
        },
      },
    ]);
    // Calculate the total purchase amount
    const totalPurchaseAmount = await OrderModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$total' },
        },
      },
    ]);

    // Retrieve the list of discount codes
    const discountCodes = await DiscountCodeModel.find(
      {},
      'code discountAmount'
    );

    // Calculate the total discount amount
    const totalDiscountAmount = discountCodes.reduce(
      (total, code) => total + code.discountAmount,
      0
    );

    res.json({
      itemCount,
      totalPurchaseAmount: totalPurchaseAmount[0].total,
      discountCodes,
      totalDiscountAmount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};

module.exports = {
  generateDiscount,
  summary,
};
