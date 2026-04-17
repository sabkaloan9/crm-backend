const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    // 🔥 LINK TO USER (VERY IMPORTANT)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    interest: {
      type: Number,
      required: true
    },

    tenure: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      default: "pending" // pending / approved / rejected
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Loan", loanSchema);