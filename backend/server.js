const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config(); // আগে .env load করো

const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");

// Models import
require("./models/Category");
require("./models/Location");
require("./models/LostItem");
require("./models/FoundItem");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

const itemRoutes = require("./routes/itemRoutes");
app.use("/api/items", itemRoutes);

app.get("/", (req, res) => {
  res.send("CampusFind API Running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});