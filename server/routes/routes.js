const express = require('express');
const router = express.Router();

const { addToCart, deleteItemFromCart } = require('../controllers/Cart');
const { registerUser, authenticateUser } = require('../controllers/User');
const {
  getUsers,
  getProsucts,
  getCartById,
} = require('../controllers/getData');

router.get('/products', getProsucts);
router.get('/users', getUsers);
router.get('/cart/:id', getCartById);

router.post('/register', registerUser);
router.post('/login', authenticateUser);

router.post('/add-to-cart', addToCart);
router.delete('/remove-from-cart/:cartId/:productId', deleteItemFromCart);

module.exports = router;
