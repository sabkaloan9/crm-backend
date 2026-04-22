const router = require("express").Router();

console.log("🔥 userRoutes file loaded");

// =====================
// TEST ROUTE
// =====================
router.get("/test", (req, res) => {
  console.log("✅ TEST ROUTE HIT");
  res.send("USER ROUTE WORKING ✅");
});

module.exports = router;