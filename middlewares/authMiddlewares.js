const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { User } = require("../models/users");
const catchAsync = require("../utils/catchAsync");
dotenv.config({ path: "./.env" });

const {
  userDataValidator,
  verifyUserEmailValidator,
} = require("../utils/userValidator");
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
  if (!value.verify) {
    return res
      .status(401)
      .json({ message: "The user has not confirmed themselves via email." });
  }
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
  else if (!currentUser.verify) {
    return res
      .status(401)
      .json({ message: "The user has not confirmed themselves via email." });
  }
  req.user = currentUser;
  next();
});

exports.uploadUserPhoto = ImageService.upload("avatar");

exports.checkVerify = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const { error } = verifyUserEmailValidator({ email });
  const user = await User.findOne({ email });

  if (error)
    return res.status(400).json({
      message: error.details[0].message,
    });

  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.verify)
    return res
      .status(400)
      .json({ message: "Verification has already been passed" });

  next();
});
