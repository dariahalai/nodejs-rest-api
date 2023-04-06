const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { User } = require("../models/users");
const catchAsync = require("../utils/catchAsync");
dotenv.config({ path: "./.env" });

const { userDataValidator } = require("../utils/userValidator");
const ImageService = require("../services/imageService");

exports.checkRegisterUserData = catchAsync(async (req, res, next) => {
  const { error, value } = userDataValidator(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const userExists = await User.exists({ email: value.email });
  if (userExists) return res.status(409).json({ message: "Email in use" });
  req.body = value;
  next();
});

exports.checkLoginUserData = catchAsync(async (req, res, next) => {
  const { error, value } = userDataValidator(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const userExists = await User.exists({ email: value.email });
  if (!userExists)
    return res.status(400).json({ message: error.details[0].message });
  req.body = value;
  next();
});

exports.protect = catchAsync(async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer") &&
    req.headers.authorization.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Not authorized" });
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const currentUser = await User.findById(decoded.id);
  console.log(currentUser);
  if (!currentUser) return res.status(401).json({ message: "Not authorized" });

  req.user = currentUser;
  next();
});

exports.uploadUserPhoto = ImageService.upload("avatar");
