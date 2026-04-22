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
// =====================
// DELETE USER
// =====================
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json("User deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

// =====================
// UPDATE USER
// =====================
router.put("/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});