const Loan = require("../models/Loan");
const User = require("../models/User");

// ================= APPLY LOAN =================
const applyLoan = async (req, res) => {
  try {
    const { amount, interest, tenure } = req.body;

    const loan = new Loan({
      userId: req.user._id, // ✅ FIXED (no manual userId)
      amount,
      interest,
      tenure
    });

    await loan.save();

    // 🔥 emit realtime update
    req.io.emit("loanUpdated");

    res.json({ message: "Loan applied" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= GET LOANS =================
const getLoans = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;

    const query = req.user.role === "admin"
      ? {}
      : { userId: req.user._id }; // ✅ USER sees own loans

    const loans = await Loan.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Loan.countDocuments(query);

    res.json({
      data: loans,
      pages: Math.ceil(total / limit)
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= UPDATE STATUS =================
const updateLoanStatus = async (req, res) => {
  try {
    // 🔒 only admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    const loan = await Loan.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    req.io.emit("loanUpdated");

    res.json(loan);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= DELETE =================
const deleteLoan = async (req, res) => {
  try {
    await Loan.findByIdAndDelete(req.params.id);

    req.io.emit("loanUpdated");

    res.json({ message: "Deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= DASHBOARD =================
const getDashboardStats = async (req, res) => {
  try {
    const query = req.user.role === "admin"
      ? {}
      : { userId: req.user._id };

    const totalLoans = await Loan.countDocuments(query);
    const approvedLoans = await Loan.countDocuments({ ...query, status: "approved" });
    const pendingLoans = await Loan.countDocuments({ ...query, status: "pending" });
    const rejectedLoans = await Loan.countDocuments({ ...query, status: "rejected" });

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