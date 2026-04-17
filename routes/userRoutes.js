const router = require("express").Router();
const User = require("../models/User");

// 🔐 MIDDLEWARE
const auth = require("../middleware/auth");
const role = require("../middleware/roleMiddleware");

const { register, login } = require("../controllers/authController");

// =====================
// AUTH ROUTES (PUBLIC)
// =====================
router.post("/register", register);
router.post("/login", login);

// =====================
// GET ALL USERS (ADMIN ONLY)
// =====================
router.get("/", auth, role(["admin"]), async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide password
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// =====================
// DELETE USER (ADMIN ONLY)
// =====================
router.delete("/:id", auth, role(["admin"]), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;