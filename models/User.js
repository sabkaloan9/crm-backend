const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,

  // CRM FIELDS
  leadId: String,
  mobile: String,
  pan: String,
  loanNo: String,

}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);