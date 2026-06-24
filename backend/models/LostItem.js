const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");
const Category = require("./Category");
const Location = require("./Location");

const LostItem = sequelize.define("LostItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  itemName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dateLost: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("pending", "active", "claimed", "recovered"),
    defaultValue: "pending",
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
  tableName: "lost_items",
  timestamps: true,
});

// Relations
LostItem.belongsTo(User, { foreignKey: "userId" });
LostItem.belongsTo(Category, { foreignKey: "categoryId" });
LostItem.belongsTo(Location, { foreignKey: "locationId" });

User.hasMany(LostItem, { foreignKey: "userId" });

module.exports = LostItem;