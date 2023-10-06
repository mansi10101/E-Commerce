const express = require('express');
const router = express.Router();

const { getProsucts } = require('../controllers/controllers');
const { registerUser, authenticateUser } = require('../controllers/User');

router.get('/products', getProsucts);
router.post('/register', registerUser);
router.post('/login', authenticateUser);

module.exports = router;
