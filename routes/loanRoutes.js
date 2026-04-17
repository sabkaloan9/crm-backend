const router = require("express").Router();
const Loan = require("../models/Loan");

// 🔐 MIDDLEWARE
const auth = require("../middleware/auth");
const role = require("../middleware/roleMiddleware");

// =====================
// GET LOANS (ADMIN + USER FILTER)
// =====================
router.get("/", auth, async (req, res) => {
  try {
    let loans;

    // 🔥 ADMIN → ALL LOANS
    if (req.user.role === "admin") {
      loans = await Loan.find().populate("userId");
    }

    // 🔥 USER → ONLY THEIR LOANS
    else {
      loans = await Loan.find({ userId: req.user.id }).populate("userId");
    }

    res.json(loans);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// CREATE LOAN (USER + ADMIN)
// =====================
router.post("/", auth, role(["admin", "user"]), async (req, res) => {
  try {
    const loan = await Loan.create({
      ...req.body,
      userId: req.user.id // 🔥 LINK TO LOGGED USER
    });

    res.json(loan);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// UPDATE LOAN (ADMIN ONLY)
// =====================
router.put("/:id", auth, role(["admin"]), async (req, res) => {
  try {
    const updated = await Loan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// DELETE LOAN (ADMIN ONLY)
// =====================
router.delete("/:id", auth, role(["admin"]), async (req, res) => {
  try {
    await Loan.findByIdAndDelete(req.params.id);
    res.json({ message: "Loan deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;