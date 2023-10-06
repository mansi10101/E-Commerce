const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const discountCodeSchema = new Schema({
  code: String,
  discountType: String, // "percentage" or "fixed"
  discountAmount: Number,
  nthOrderRequirement: Number, // The order count at which the discount is valid
});

module.exports = mongoose.model('DiscountCode', discountCodeSchema);
