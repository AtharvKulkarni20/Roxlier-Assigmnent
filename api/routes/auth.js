const express = require("express");
const { 
  signup, 
  login, 
  updatePassword, 
  forgotPassword, 
  resetPassword 
} = require("../controllers/authController");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.patch("/password", authenticate, updatePassword);

module.exports = router;