const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");
const FoundItem = require("./FoundItem");

const Claim = sequelize.define("Claim", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  proofDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending",
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  foundItemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: "claims",
  timestamps: true,
});

// Relations
Claim.belongsTo(User, { foreignKey: "userId" });
Claim.belongsTo(FoundItem, { foreignKey: "foundItemId" });

User.hasMany(Claim, { foreignKey: "userId" });
FoundItem.hasMany(Claim, { foreignKey: "foundItemId" });

module.exports = Claim;