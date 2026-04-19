const router = require("express").Router();
const User = require("../models/User");

const auth = require("../middleware/auth");
const { requireRole, requirePermission } = require("../middleware/rbac");

const { register, login } = require("../controllers/authController");

// =====================
// AUTH (PUBLIC)
// =====================
router.post("/register", register);
router.post("/login", login);

// =====================
// GET USERS (PAGINATED + RBAC)
// =====================
router.get(
  "/",
  auth,
  requireRole(["superadmin", "admin"]),
  requirePermission(["user.view"]),
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const users = await User.find()
        .select("-password")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await User.countDocuments();

      res.json({
        data: users,
        total,
        page,
        pages: Math.ceil(total / limit)
      });

    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// =====================
// DELETE USER (SAFE + RBAC)
// =====================
router.delete(
  "/:id",
  auth,
  requireRole(["superadmin", "admin"]),
  requirePermission(["user.delete"]),
  async (req, res) => {
    try {
      // 🚨 prevent self-delete accident
      if (req.user.id === req.params.id) {
        return res.status(400).json({
          message: "You cannot delete your own account"
        });
      }

      const deleted = await User.findByIdAndDelete(req.params.id);

      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully" });

    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;