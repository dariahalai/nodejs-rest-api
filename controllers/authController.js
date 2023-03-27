const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { User } = require("../models/users");
dotenv.config({ path: "./.env" });

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });

exports.register = async (req, res, next) => {
  const newUser = await User.create(req.body);

  newUser.password = undefined;

  return res.status(201).json(newUser);
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user)
    return res.status(401).json({ message: "Invalid email or password" });

  const passwordIsValid = await user.checkPassword(password, user.password);
  if (!passwordIsValid)
    return res.status(401).json({ message: "Invalid email or password" });

  const token = signToken(user.id);
  user.setToken(token);
  const loginUser = await user.save();
  const { _id, subscription } = loginUser;
  return res.status(200).json({ _id, email, subscription, token });
};

exports.logoutUser = async (req, res, next) => {
  const user = req.user;

  user.setToken(null);

  const logoutUser = await user.save();
  if (!logoutUser) {
    return res.status(500).json({ message: "Something went wrong..." });
  }

  res.status(204).send();
};

exports.getCurrentUser = async (req, res, next) => {
  const currentUser = req.user;
  return res.status(200).json(currentUser);
};
