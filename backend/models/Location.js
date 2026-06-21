const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Location = sequelize.define("Location", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  locationName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: "locations",
  timestamps: false,
});

module.exports = Location;