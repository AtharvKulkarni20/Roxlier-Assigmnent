const express = require("express");
const { getDashboard, updatePassword } = require("../controllers/storeController");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Store owner routes
router.get("/dashboard", authenticate, getDashboard);
router.patch("/password", authenticate, updatePassword);

module.exports = router;