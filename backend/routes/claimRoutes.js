const express = require("express");
const router = express.Router();
const { submitClaim, getMyClaims } = require("../controllers/claimController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, submitClaim);
router.get("/my", protect, getMyClaims);

module.exports = router;