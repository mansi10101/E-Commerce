const UserModel = require('../models/User');
var bcrypt = require('bcrypt');

var BCRYPT_SALT_ROUNDS = 12;

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const userExist = await UserModel.findOne({ email: email });
  if (userExist) {
    return res.status(403).json({
      error: 'Email already exist.',
    });
  } else {
    bcrypt
      .hash(password, BCRYPT_SALT_ROUNDS)
      .then(function (hashedPassword) {
        return UserModel.create({ email, password: hashedPassword });
      })
      .then(function () {
        res.status(200).json({ message: 'SignUp Sucessfull!' });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
};

const authenticateUser = async (req, res) => {
  const { email, password } = req.body();
  await UserModel.findOne({ email: email })
    .then(function (user) {
      return bcrypt.compare(password, user.password);
    })
    .then(function (samePassword) {
      if (!samePassword) {
        return res.status(403).json({
          error: 'Incorrect Password !!',
        });
      } else {
        res.status(200).json({ message: 'Login Sucessfull!' });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

module.exports = {
  registerUser,
  authenticateUser,
};
