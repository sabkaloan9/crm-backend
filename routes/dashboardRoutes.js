const router = require("express").Router();
const auth = require("../middleware/auth");

// =====================
// DASHBOARD (TEMP FIX)
// =====================
router.get("/", auth, async (req, res) => {
  try {
    // 🔥 TEMP: REMOVE ADMIN CHECK TO FIX 403
    // if (!req.user.isAdmin) {
    //   return res.status(403).json("Access denied");
    // }

    res.json({
      message: "Dashboard data loaded successfully",
      user: req.user,
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;