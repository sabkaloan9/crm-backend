const Loan = require("../models/Loan");
const User = require("../models/User");

// Apply Loan
const applyLoan = async (req, res) => {
  try {
    const { userId, amount, interest, tenure } = req.body;

    const emi = (amount * interest) / 100 / tenure;

    const loan = new Loan({
      userId,
      amount,
      interest,
      tenure,
      emi,
    });

    const savedLoan = await loan.save();

    res.json(savedLoan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Loans
const getLoans = async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate("userId")
      .sort({ createdAt: -1 });

    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Loan Status
const updateLoanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const loan = await Loan.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.json(loan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Loan
const deleteLoan = async (req, res) => {
  try {
    const { id } = req.params;

    await Loan.findByIdAndDelete(id);

    res.json({ message: "Loan deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dashboard Stats
const getDashboardStats = async (req, res) => {
  try {
    const totalLoans = await Loan.countDocuments();

    const approvedLoans = await Loan.countDocuments({ status: "approved" });
    const pendingLoans = await Loan.countDocuments({ status: "pending" });
    const rejectedLoans = await Loan.countDocuments({ status: "rejected" });

    const totalUsers = await User.countDocuments();

    res.json({
      totalUsers,
      totalLoans,
      approvedLoans,
      pendingLoans,
      rejectedLoans,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  applyLoan,
  getLoans,
  updateLoanStatus,
  deleteLoan,
  getDashboardStats
};