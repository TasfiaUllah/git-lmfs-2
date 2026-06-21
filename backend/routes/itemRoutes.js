const express = require("express");
const router = express.Router();
const {
  getRecentLostItems,
  getRecentFoundItems,
  reportLostItem,
  reportFoundItem,
  searchItems,
} = require("../controllers/itemController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get("/lost/recent", getRecentLostItems);
router.get("/found/recent", getRecentFoundItems);
router.get("/search", searchItems);

// Protected routes
router.post("/lost/report", protect, reportLostItem);
router.post("/found/report", protect, reportFoundItem);

module.exports = router;