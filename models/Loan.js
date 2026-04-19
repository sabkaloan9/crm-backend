const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    // 👤 OWNER
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // 💰 LOAN DETAILS
    amount: {
      type: Number,
      required: true,
      min: 1
    },

    interest: {
      type: Number,
      required: true,
      min: 0
    },

    tenure: {
      type: Number,
      required: true
    },

    // 📊 LOAN STATUS (ENTERPRISE WORKFLOW)
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "closed"],
      default: "pending"
    },

    // 👑 APPROVAL TRACKING
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    // 🧠 BUSINESS METADATA
    emiAmount: {
      type: Number,
      default: 0
    },

    totalPayable: {
      type: Number,
      default: 0
    },

    remainingAmount: {
      type: Number,
      default: 0
    },

    // 📅 IMPORTANT DATES
    startDate: {
      type: Date,
      default: null
    },

    endDate: {
      type: Date,
      default: null
    },

    // 🔐 AUDIT / TRACKING (SAAS LEVEL)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Loan", loanSchema);