const router = require("express").Router();
const User = require("../models/User");

// =====================
// SEARCH USERS
// =====================
router.get("/search", async (req, res) => {
  try {
    const q = req.query.q;

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { mobile: { $regex: q, $options: "i" } },
        { pan: { $regex: q, $options: "i" } },
        { loanNo: { $regex: q, $options: "i" } },
      ],
    });

    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// =====================
// DELETE USER
// =====================
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    // 🔥 REALTIME
    req.io.emit("userDeleted", req.params.id);

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

    // 🔥 REALTIME
    req.io.emit("userUpdated", updated);

    res.json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;