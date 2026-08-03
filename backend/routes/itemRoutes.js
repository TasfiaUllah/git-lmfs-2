const express = require("express");
const router = express.Router();
const {
  getRecentLostItems,
  getRecentFoundItems,
  getHomeStats,
  reportLostItem,
  reportFoundItem,
  searchItems,
  getAllFoundItems,
  getAllLostItems,
  getAllCategories,
  getAllLocations,
  getDashboardStats,
  getMyLostItems,
  getMyFoundItems,
  getFoundItemById,
  getLostItemById,
  getSimilarItems,
  saveItem,
  unsaveItem,
  getSavedItems,
} = require("../controllers/itemController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get("/lost/recent", getRecentLostItems);
router.get("/found/recent", getRecentFoundItems);
router.get("/stats", getHomeStats);
router.get("/found/all", getAllFoundItems);
router.get("/lost/all", getAllLostItems);
router.get("/search", searchItems);
router.get("/categories", getAllCategories);
router.get("/locations", getAllLocations);

// Protected routes
router.post("/lost/report", protect, reportLostItem);
router.post("/found/report", protect, reportFoundItem);
router.post("/save", protect, saveItem);
router.delete("/save", protect, unsaveItem);

router.get("/saved/my", protect, getSavedItems);
router.get("/dashboard/stats", protect, getDashboardStats);
router.get("/lost/my", protect, getMyLostItems);
router.get("/found/my", protect, getMyFoundItems);
router.get("/found/:id", getFoundItemById);
router.get("/lost/:id", getLostItemById);
router.get("/similar/:type/:id", getSimilarItems);

module.exports = router;
