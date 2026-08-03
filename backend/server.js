const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const claimRoutes = require("./routes/claimRoutes"); 

// Models import
require("./models/Category");
require("./models/Location");
require("./models/LostItem");
require("./models/FoundItem");
require("./models/Claim");
require("./models/SavedItem");


connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/images", express.static("public/images"));
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/claims", claimRoutes);


app.get("/", (req, res) => {
  res.send("CampusFind API Running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});