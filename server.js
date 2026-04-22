require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json());

// =====================
// API ROUTES (FIRST)
// =====================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/loans", require("./routes/loanRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// =====================
// ROOT TEST
// =====================
app.get("/", (req, res) => {
  res.json({ message: "CRM API working ✅" });
});

// =====================
// HEALTH
// =====================
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// =====================
// SERVE FRONTEND (OPTIONAL)
// =====================
app.use(express.static(path.join(__dirname, "public")));

// ⚠️ MUST BE LAST (VERY IMPORTANT)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// =====================
// DATABASE
// =====================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("DB ERROR:", err));

// =====================
// START
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});