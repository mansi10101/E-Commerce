const DiscountCodeModel = require('../models/DiscountCode'); // Create a DiscountCode model using Mongoose

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

module.exports = {
  generateDiscount,
};
