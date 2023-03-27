const express = require("express");
const {
  register,
  loginUser,
  logoutUser,
  getCurrentUser,
} = require("../../controllers/authController");
const {
  checkRegisterUserData,
  protect,
} = require("../../middlewares/authMiddlewares");

const catchAsync = require("../../utils/catchAsync");

const router = express.Router();

router.post("/register", checkRegisterUserData, catchAsync(register));

router.post("/login", catchAsync(loginUser));

router.post("/logout", protect, catchAsync(logoutUser));

router.post("/current", protect, catchAsync(getCurrentUser));

module.exports = router;
