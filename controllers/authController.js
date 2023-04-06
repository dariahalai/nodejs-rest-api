const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { User } = require("../models/users");
const ImageService = require("../services/imageService");
dotenv.config({ path: "./.env" });

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });

exports.register = async (req, res, next) => {
  const newUser = await User.create(req.body);

  newUser.password = undefined;

  return res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!password) return res.status(401).json({ message: "Not authorized" });

  const user = await User.findOne({ email }).select("+password");
  if (!user)
    return res.status(401).json({ message: "Invalid email or password" });

  const passwordIsValid = await user.checkPassword(password, user.password);
  if (!passwordIsValid)
    return res.status(401).json({ message: "Invalid email or password" });

  const token = signToken(user.id);
  user.setToken(token);
  const loginUser = await user.save();

  return res.status(200).json({
    token: loginUser.token,
    user: {
      email: loginUser.email,
      subscription: loginUser.subscription,
    },
  });
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
  return res
    .status(200)
    .json({ email: currentUser.email, subscription: currentUser.subscription });
};

exports.updateAvatars = async (req, res, next) => {
  const { file, user } = req;
  console.log(user);
  if (file) {
    user.avatarURL = await ImageService.save(file, 250, 250, "avatars");
  }

  Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));

  const updatedUser = await user.save();

  res.status(200).json({ avatarURL: updatedUser.avatarURL });
};
