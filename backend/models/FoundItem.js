const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");
const Category = require("./Category");
const Location = require("./Location");

const FoundItem = sequelize.define("FoundItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  currentlyWith: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  images: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  itemName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dateFound: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("pending", "active", "claimed", "recovered"),
    defaultValue: "pending",
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  locationId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: "found_items",
  timestamps: true,
});

// Relations
FoundItem.belongsTo(User, { foreignKey: "userId" });
FoundItem.belongsTo(Category, { foreignKey: "categoryId" });
FoundItem.belongsTo(Location, { foreignKey: "locationId" });

User.hasMany(FoundItem, { foreignKey: "userId" });

module.exports = FoundItem;