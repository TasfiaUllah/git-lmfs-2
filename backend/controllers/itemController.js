const LostItem = require("../models/LostItem");
const FoundItem = require("../models/FoundItem");
const Category = require("../models/Category");
const Location = require("../models/Location");

// ✅ GET Recent Lost Items (Home page এর জন্য)
const getRecentLostItems = async (req, res) => {
  try {
    const items = await LostItem.findAll({
      where: { status: "active" },
      limit: 4,
      order: [["createdAt", "DESC"]],
      include: [
        { model: Category, attributes: ["categoryName"] },
        { model: Location, attributes: ["locationName"] },
      ],
    });
    res.status(200).json({ items });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ GET Recent Found Items (Home page এর জন্য)
const getRecentFoundItems = async (req, res) => {
  try {
    const items = await FoundItem.findAll({
      where: { status: "active" },
      limit: 4,
      order: [["createdAt", "DESC"]],
      include: [
        { model: Category, attributes: ["categoryName"] },
        { model: Location, attributes: ["locationName"] },
      ],
    });
    res.status(200).json({ items });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ POST Report Lost Item
const reportLostItem = async (req, res) => {
  const { itemName, description, dateLost, categoryId, locationId } = req.body;

  if (!itemName || !categoryId) {
    return res.status(400).json({ message: "Item name and category are required ❌" });
  }

  try {
    const item = await LostItem.create({
      itemName,
      description,
      dateLost,
      categoryId,
      locationId,
      userId: req.user.id,
      status: "pending",
    });

    res.status(201).json({ message: "Lost item reported ✅", item });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ POST Report Found Item
const reportFoundItem = async (req, res) => {
  const { itemName, description, dateFound, categoryId, locationId } = req.body;

  if (!itemName || !categoryId) {
    return res.status(400).json({ message: "Item name and category are required ❌" });
  }

  try {
    const item = await FoundItem.create({
      itemName,
      description,
      dateFound,
      categoryId,
      locationId,
      userId: req.user.id,
      status: "pending",
    });

    res.status(201).json({ message: "Found item reported ✅", item });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getRecentLostItems,
  getRecentFoundItems,
  reportLostItem,
  reportFoundItem,
};