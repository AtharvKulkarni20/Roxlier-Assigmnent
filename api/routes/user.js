const express = require("express");
const { getAllStores, submitRating, getMyRatings, getUser } = require("../controllers/userController");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Normal user routes
router.get("/stores", authenticate, getAllStores);
router.post("/rating", authenticate, submitRating);
router.get("/my-ratings", authenticate, getMyRatings);
router.get("/", authenticate, getUser)

module.exports = router;
