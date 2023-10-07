const { hash } = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  orderCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', userSchema);
