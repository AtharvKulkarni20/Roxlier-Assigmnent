const express = require("express");
const { getDashboardStats, listUsers, listStores } = require("../controllers/adminController");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Admin-only routes
router.get("/dashboard", authenticate, getDashboardStats);
router.get("/users", authenticate, listUsers);
router.get("/stores", authenticate, listStores);

module.exports = router;
