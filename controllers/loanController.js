const Loan = require("../models/Loan");
const User = require("../models/User");

// =====================
// APPLY LOAN (FIXED SaaS)
// =====================
const applyLoan = async (req, res) => {
  try {
    const { amount, interest, tenure } = req.body;

    const loan = await Loan.create({
      userId: req.user._id, // ✅ FIXED
      amount,
      interest,
      tenure,
      status: "pending"
    });

    // 🔥 SOCKET EVENT
    req.app.get("io").emit("loanUpdated");

    res.status(201).json(loan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =====================
// GET LOANS (ROLE SAFE)
// =====================
const getLoans = async (req, res) => {
  try {
    const query =
      req.user.role === "admin"
        ? {}
        : { userId: req.user._id };

    const loans = await Loan.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(loans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =====================
// UPDATE STATUS (ADMIN)
// =====================
const updateLoanStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Loan.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    // 🔥 SOCKET EVENT
    req.app.get("io").emit("loanUpdated");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =====================
// DELETE LOAN
// =====================
const deleteLoan = async (req, res) => {
  try {
    await Loan.findByIdAndDelete(req.params.id);

    req.app.get("io").emit("loanUpdated");

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =====================
// DASHBOARD STATS
// =====================
const getDashboardStats = async (req, res) => {
  try {
    const totalLoans = await Loan.countDocuments();
    const approvedLoans = await Loan.countDocuments({ status: "approved" });
    const pendingLoans = await Loan.countDocuments({ status: "pending" });
    const rejectedLoans = await Loan.countDocuments({ status: "rejected" });

    const totalUsers = await User.countDocuments();

    res.json({
      totalLoans,
      approvedLoans,
      pendingLoans,
      rejectedLoans,
      totalUsers
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  applyLoan,
  getLoans,
  updateLoanStatus,
  deleteLoan,
  getDashboardStats
};