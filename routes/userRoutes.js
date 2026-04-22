const router = require("express").Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// SEARCH
router.get("/search", auth, async (req, res) => {
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
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);

  req.io.emit("notify", { msg: "User deleted", type: "error" });
  req.io.emit("userDeleted");

  res.json("Deleted");
});

// UPDATE
router.put("/:id", auth, async (req, res) => {
  const updated = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  req.io.emit("notify", { msg: "User updated", type: "success" });
  req.io.emit("userUpdated");

  res.json(updated);
});

module.exports = router;