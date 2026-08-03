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
const upload = require("../middleware/upload");

// Public routes
router.get("/lost/recent", getRecentLostItems);
router.get("/found/recent", getRecentFoundItems);
router.get("/search", searchItems);

// Protected routes
router.post("/lost/report", protect, upload.array("images", 4), reportLostItem);
router.post("/found/report", protect, upload.array("images", 4), reportFoundItem);

module.exports = router;