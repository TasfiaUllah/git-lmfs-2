const LostItem = require("../models/LostItem");
const FoundItem = require("../models/FoundItem");
const Category = require("../models/Category");
const Location = require("../models/Location");
const User = require("../models/User");


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

// ✅ Search Items
const searchItems = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: "Search query is required ❌" });
  }

  try {
    const { Op } = require("sequelize");

    const lostItems = await LostItem.findAll({
      where: {
        status: "active",
        [Op.or]: [
          { itemName: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } },
        ],
      },
      include: [
        { model: Category, attributes: ["categoryName"] },
        { model: Location, attributes: ["locationName"] },
      ],
    });

    const foundItems = await FoundItem.findAll({
      where: {
        status: "active",
        [Op.or]: [
          { itemName: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } },
        ],
      },
      include: [
        { model: Category, attributes: ["categoryName"] },
        { model: Location, attributes: ["locationName"] },
      ],
    });

    res.status(200).json({ lostItems, foundItems });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ GET All Found Items with filters
const getAllFoundItems = async (req, res) => {
  const { category, location, status } = req.query;

  try {
    const where = {};

    if (status) {
      where.status = status;
    } else {
      where.status = "active";
    }

    if (category) where.categoryId = category;
    if (location) where.locationId = location;

    const items = await FoundItem.findAll({
      where,
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

// ✅ GET All Lost Items with filters
const getAllLostItems = async (req, res) => {
  const { category, location, status } = req.query;

  try {
    const where = {};

    if (status) {
      where.status = status;
    } else {
      where.status = "active";
    }

    if (category) where.categoryId = category;
    if (location) where.locationId = location;

    const items = await LostItem.findAll({
      where,
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

// ✅ GET All Categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ GET All Locations
const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.findAll();
    res.status(200).json({ locations });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Helper: item status -> claim status label
const getClaimStatusLabel = (status) => {
  if (status === "claimed") return "Under Review";
  if (status === "recovered") return "Resolved";
  return "No Claims";
};

// ✅ GET Dashboard Stats
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [myLostItems, myFoundItems, activeClaims, resolved] = await Promise.all([
      LostItem.count({ where: { userId } }),
      FoundItem.count({ where: { userId } }),
      Promise.all([
        LostItem.count({ where: { userId, status: "claimed" } }),
        FoundItem.count({ where: { userId, status: "claimed" } }),
      ]).then(([l, f]) => l + f),
      Promise.all([
        LostItem.count({ where: { userId, status: "recovered" } }),
        FoundItem.count({ where: { userId, status: "recovered" } }),
      ]).then(([l, f]) => l + f),
    ]);

    res.status(200).json({ myLostItems, myFoundItems, activeClaims, resolved });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ GET My Lost Items
const getMyLostItems = async (req, res) => {
  try {
    const userId = req.user.id;
    const { search, sort } = req.query;
    const { Op } = require("sequelize");

    const where = { userId };
    if (search) where.itemName = { [Op.like]: `%${search}%` };

    const order = sort === "oldest" ? [["createdAt", "ASC"]] : [["createdAt", "DESC"]];

    const items = await LostItem.findAll({
      where,
      order,
      include: [
        { model: Category, attributes: ["categoryName"] },
        { model: Location, attributes: ["locationName"] },
      ],
    });

    const formatted = items.map((item) => ({
      ...item.toJSON(),
      claimStatus: getClaimStatusLabel(item.status),
    }));

    res.status(200).json({ count: formatted.length, items: formatted });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ GET My Found Items
const getMyFoundItems = async (req, res) => {
  try {
    const userId = req.user.id;
    const { search, sort } = req.query;
    const { Op } = require("sequelize");

    const where = { userId };
    if (search) where.itemName = { [Op.like]: `%${search}%` };

    const order = sort === "oldest" ? [["createdAt", "ASC"]] : [["createdAt", "DESC"]];

    const items = await FoundItem.findAll({
      where,
      order,
      include: [
        { model: Category, attributes: ["categoryName"] },
        { model: Location, attributes: ["locationName"] },
      ],
    });

    const formatted = items.map((item) => ({
      ...item.toJSON(),
      claimStatus: getClaimStatusLabel(item.status),
    }));

    res.status(200).json({ count: formatted.length, items: formatted });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// ✅ GET Single Lost Item Detail (Item Details Page)
const getLostItemById = async (req, res) => {
  try {
    const { id } = req.params;
 
    const item = await LostItem.findByPk(id, {
      include: [
        { model: Category, attributes: ["categoryName"] },
        { model: Location, attributes: ["locationName"] },
        { model: User, attributes: ["id", "fullName", "matrixId", "department", "verified"] },
      ],
    });
 
    if (!item) {
      return res.status(404).json({ message: "Lost item not found ❌" });
    }
 
    await item.increment("views");
    await item.reload();
 
    res.status(200).json({ item });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
 
// ✅ GET Single Found Item Detail (Item Details Page) - claims count shoho
const getFoundItemById = async (req, res) => {
  try {
    const { id } = req.params;
 
    const item = await FoundItem.findByPk(id, {
      include: [
        { model: Category, attributes: ["categoryName"] },
        { model: Location, attributes: ["locationName"] },
        { model: User, attributes: ["id", "fullName", "matrixId", "department", "verified"] },
      ],
    });
 
    if (!item) {
      return res.status(404).json({ message: "Found item not found ❌" });
    }
 
    await item.increment("views");
    await item.reload();
 
    const Claim = require("../models/Claim");
    const claimsCount = await Claim.count({ where: { foundItemId: id } });
 
    res.status(200).json({ item, claimsSubmitted: claimsCount });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
 
// ✅ GET Similar Items (same category, same type, current item bade)
const getSimilarItems = async (req, res) => {
  try {
    const { type, id } = req.params; // type = "lost" or "found"
    const Model = type === "found" ? FoundItem : LostItem;
 
    const currentItem = await Model.findByPk(id);
    if (!currentItem) {
      return res.status(404).json({ message: "Item not found ❌" });
    }
 
    const { Op } = require("sequelize");
    const items = await Model.findAll({
      where: {
        categoryId: currentItem.categoryId,
        id: { [Op.ne]: id },
        status: "active",
      },
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
 
// ✅ POST Save Item (bookmark)
const saveItem = async (req, res) => {
  const { itemType, itemId } = req.body; // itemType: "lost" | "found"
 
  if (!itemType || !itemId) {
    return res.status(400).json({ message: "itemType and itemId are required ❌" });
  }
 
  try {
    const SavedItem = require("../models/SavedItem");
 
    const existing = await SavedItem.findOne({
      where: { userId: req.user.id, itemType, itemId },
    });
    if (existing) {
      return res.status(400).json({ message: "Item already saved ❌" });
    }
 
    const saved = await SavedItem.create({
      userId: req.user.id,
      itemType,
      itemId,
    });
 
    res.status(201).json({ message: "Item saved ✅", saved });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
 
// ✅ DELETE Unsave Item
const unsaveItem = async (req, res) => {
  const { itemType, itemId } = req.body;
 
  try {
    const SavedItem = require("../models/SavedItem");
 
    const deleted = await SavedItem.destroy({
      where: { userId: req.user.id, itemType, itemId },
    });
 
    if (!deleted) {
      return res.status(404).json({ message: "Saved item not found ❌" });
    }
 
    res.status(200).json({ message: "Item removed from saved list ✅" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
 
// ✅ GET My Saved Items
const getSavedItems = async (req, res) => {
  try {
    const SavedItem = require("../models/SavedItem");
 
    const savedRows = await SavedItem.findAll({ where: { userId: req.user.id } });
 
    const items = await Promise.all(
      savedRows.map(async (row) => {
        const Model = row.itemType === "found" ? FoundItem : LostItem;
        const item = await Model.findByPk(row.itemId, {
          include: [
            { model: Category, attributes: ["categoryName"] },
            { model: Location, attributes: ["locationName"] },
          ],
        });
        return { itemType: row.itemType, savedAt: row.createdAt, item };
      })
    );
 
    res.status(200).json({ count: items.length, items });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getRecentLostItems,
  getRecentFoundItems,
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
};

