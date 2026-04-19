const router = require("express").Router();

const auth = require("../middleware/auth");
const role = require("../middleware/roleMiddleware");

const {
  applyLoan,
  getLoans,
  updateLoanStatus,
  deleteLoan
} = require("../controllers/loanController");

// =====================
// GET LOANS
// =====================
router.get("/", auth, getLoans);

// =====================
// APPLY LOAN
// =====================
router.post("/", auth, applyLoan);

// =====================
// UPDATE STATUS (ADMIN)
// =====================
router.put("/:id/status", auth, role(["admin"]), updateLoanStatus);

// =====================
// DELETE
// =====================
router.delete("/:id", auth, role(["admin"]), deleteLoan);

module.exports = router;