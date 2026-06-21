const express = require("express");
const router = express.Router();
const {
  getRecentLostItems,
  getRecentFoundItems,
  reportLostItem,
  reportFoundItem,
} = require("../controllers/itemController");
const { protect } = require("../middleware/authMiddleware");

// Public routes — login ছাড়াই দেখা যাবে
router.get("/lost/recent", getRecentLostItems);
router.get("/found/recent", getRecentFoundItems);

// Protected routes — login করতে হবে
router.post("/lost/report", protect, reportLostItem);
router.post("/found/report", protect, reportFoundItem);

module.exports = router;