const UserModel = require('../models/User');
var bcrypt = require('bcrypt');

var BCRYPT_SALT_ROUNDS = 12;

const registerUser = async (req, res) => {
  const { email, password, name } = req.body;
  const userExist = await UserModel.findOne({ email: email });
  if (userExist) {
    return res.status(403).json({
      error: 'Email already exist.',
    });
  } else {
    bcrypt
      .hash(password, BCRYPT_SALT_ROUNDS)
      .then(function (hashedPassword) {
        const user = UserModel.create({
          email,
          password: hashedPassword,
          name,
        });
        return user;
      })
      .then(function (user) {
        res.status(200).json(user);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
};

const authenticateUser = async (req, res) => {
  const { email, password } = req.body;
  await UserModel.findOne({ email: email })
    .then(function (user) {
      const samePassword = bcrypt.compare(password, user.password);
      return { samePassword, user };
    })
    .then(function (user) {
      if (!user.samePassword) {
        return res.status(403).json({
          error: 'Incorrect Password !!',
        });
      } else {
        res.status(200).json(user.user);
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
