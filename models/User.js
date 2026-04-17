const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    // 🔴 VERY IMPORTANT (THIS WAS YOUR ISSUE)
    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "user",
    },

    status: {
      type: String,
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);