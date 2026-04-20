const router = require("express").Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// =====================
// GET USERS (ADMIN ONLY)
// =====================
router.get("/", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json("Access denied");
    }

    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// =====================
// MAKE ADMIN
// =====================
router.put("/make-admin/:id", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json("Access denied");
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isAdmin: true },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;