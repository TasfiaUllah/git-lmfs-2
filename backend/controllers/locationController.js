const Location = require("../models/Location");

const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.findAll();
    res.status(200).json({ locations });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getAllLocations };