const router = require("express").Router();

const auth = require("../middleware/auth");
const { requireRole, requirePermission } = require("../middleware/rbac");

const { getDashboardStats } = require("../controllers/loanController");

// =====================
// DASHBOARD STATS (ENTERPRISE SAAS PROTECTED)
// =====================
router.get(
  "/",
  auth,
  requireRole(["admin", "superadmin"]),
  requirePermission(["dashboard.view"]),
  async (req, res) => {
    try {
      await getDashboardStats(req, res);
    } catch (err) {
      console.log("DASHBOARD ERROR:", err);
      res.status(500).json({
        message: "Dashboard error"
      });
    }
  }
);

module.exports = router;