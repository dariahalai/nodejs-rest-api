const express = require("express");
const {
  register,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateAvatars,
} = require("../../controllers/authController");
const {
  checkRegisterUserData,
  checkLoginUserData,
  protect,
  uploadUserPhoto,
} = require("../../middlewares/authMiddlewares");

const catchAsync = require("../../utils/catchAsync");

const router = express.Router();

router.post("/register", checkRegisterUserData, catchAsync(register));

router.post("/login", checkLoginUserData, catchAsync(loginUser));

router.post("/logout", protect, catchAsync(logoutUser));

router.get("/current", protect, catchAsync(getCurrentUser));

router.patch("/avatars", protect, uploadUserPhoto, catchAsync(updateAvatars));

module.exports = router;
