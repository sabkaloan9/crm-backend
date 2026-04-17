const router = require("express").Router();
const auth = require("../middleware/auth");

const { getDashboardStats } = require("../controllers/loanController");

// =====================
// DASHBOARD STATS (PROTECTED)
// =====================
router.get("/", auth, getDashboardStats);

module.exports = router;