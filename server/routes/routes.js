const express = require('express');
const router = express.Router();

const { addToCart, deleteItemFromCart } = require('../controllers/Cart');
const { registerUser, authenticateUser } = require('../controllers/User');
const {
  getUsers,
  getProsucts,
  getCartById,
  increase_product,
  decrease_product,
} = require('../controllers/getData');
const { checkout, checkDiscount } = require('../controllers/Order');
const { generateDiscount } = require('../controllers/AdminAPI');

router.get('/products', getProsucts);
router.get('/cart/:id', getCartById);
router.patch('/cart/:id/increase-item', increase_product);
router.patch('/cart/:id/decrease-item', decrease_product);

router.post('/register', registerUser);
router.post('/login', authenticateUser);

router.post('/add-to-cart', addToCart);
router.delete('/remove-from-cart/:cartId/:productId', deleteItemFromCart);

router.post('/checkout', checkout);
router.post('/check-discount', checkDiscount);

router.post('/generate-discount-code', generateDiscount);

module.exports = router;
