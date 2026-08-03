const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");

const SavedItem = sequelize.define("SavedItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  itemType: {
    type: DataTypes.ENUM("lost", "found"),
    allowNull: false,
  },
  itemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: "saved_items",
  timestamps: true,
});

SavedItem.belongsTo(User, { foreignKey: "userId" });
User.hasMany(SavedItem, { foreignKey: "userId" });

module.exports = SavedItem;