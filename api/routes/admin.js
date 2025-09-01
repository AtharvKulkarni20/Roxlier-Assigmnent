const express = require("express");
const { 
  getDashboardStats, 
  listUsers, 
  listStores, 
  addStore, 
  addUser, 
  getUser, 
  deleteUser, 
  deleteStore,
  getStore,
  getAllRatings,
  listUsersWithFilters,
  listStoresWithFilters
} = require("../controllers/adminController");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.get("/dashboard", authenticate, getDashboardStats);

// User management
router.get("/users", authenticate, listUsersWithFilters);
router.get("/users/list", authenticate, listUsers); // Keep for backward compatibility
router.get("/users/:id", authenticate, getUser);
router.post("/users", authenticate, addUser);
router.delete("/users/:id", authenticate, deleteUser);

// Store management
router.get("/stores", authenticate, listStoresWithFilters);
router.get("/stores/list", authenticate, listStores); // Keep for backward compatibility
router.get("/stores/:id", authenticate, getStore);
router.post("/stores", authenticate, addStore);
router.delete("/stores/:id", authenticate, deleteStore);

// Rating management
router.get("/ratings", authenticate, getAllRatings);

module.exports = router;
