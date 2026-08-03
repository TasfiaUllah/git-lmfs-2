const Claim = require("../models/Claim");
const FoundItem = require("../models/FoundItem");
const Category = require("../models/Category");
const Location = require("../models/Location");
const User = require("../models/User");

// ✅ POST Submit a Claim (kono FoundItem-er upor claim submit kora)
const submitClaim = async (req, res) => {
  const { foundItemId, proofDescription } = req.body;

  if (!foundItemId) {
    return res.status(400).json({ message: "Found item id is required ❌" });
  }

  try {
    const foundItem = await FoundItem.findByPk(foundItemId);
    if (!foundItem) {
      return res.status(404).json({ message: "Found item not found ❌" });
    }

    const claim = await Claim.create({
      foundItemId,
      proofDescription,
      userId: req.user.id,
      status: "pending",
    });

    res.status(201).json({ message: "Claim submitted ✅", claim });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ GET My Claims (Claims Submitted page - filters + search shoho)
const getMyClaims = async (req, res) => {
  try {
    const userId = req.user.id;
    const { search, category, location, date, sort, status } = req.query;
    const { Op } = require("sequelize");

    const where = { userId };

    // Default: sudhu pending claims dekhabe (Claims Submitted page)
    // status=resolved -> approved + rejected shob
    // status=approved / status=rejected -> shudhu shei ta
    if (status === "resolved") {
      where.status = { [Op.in]: ["approved", "rejected"] };
    } else if (status === "approved" || status === "rejected") {
      where.status = status;
    } else {
      where.status = "pending";
    }

    const foundItemWhere = {};
    if (search) {
      foundItemWhere[Op.or] = [
        { itemName: { [Op.like]: `%${search}%` } },
        ...(Number.isInteger(Number(search)) ? [{ id: Number(search) }] : []),
      ];
    }
    if (category) foundItemWhere.categoryId = category;
    if (location) foundItemWhere.locationId = location;
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      foundItemWhere.dateFound = { [Op.gte]: start, [Op.lt]: end };
    }

    const order =
      sort === "oldest" ? [["createdAt", "ASC"]] : [["createdAt", "DESC"]];

    const claims = await Claim.findAll({
      where,
      order,
      include: [
        {
          model: FoundItem,
          where: Object.keys(foundItemWhere).length ? foundItemWhere : undefined,
          include: [
            { model: Category, attributes: ["categoryName"] },
            { model: Location, attributes: ["locationName"] },
            { model: User, attributes: ["id", "fullName", "matrixId"] }, // Reported By (finder)
          ],
        },
      ],
    });

    // Resolution date/time calculate kora (sudhu resolved claims-er jonno)
    const formatted = claims.map((claim) => {
      const data = claim.toJSON();
      if (data.status === "approved" || data.status === "rejected") {
        const diffMs = new Date(data.updatedAt) - new Date(data.createdAt);
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        data.resolutionDate = data.updatedAt;
        data.resolutionTime = {
          days: Math.floor(diffHours / 24),
          hours: diffHours % 24,
        };
        data.outcome = data.status === "approved" ? "Approved" : "Rejected";
      }
      return data;
    });

    res.status(200).json({ count: formatted.length, claims: formatted });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { submitClaim, getMyClaims };