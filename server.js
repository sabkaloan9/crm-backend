require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json());

// =====================
// 🔥 DEPLOY CHECK (CRITICAL)
// =====================
app.get("/check123", (req, res) => {
  res.send("DEPLOY CHECK SUCCESS ✅");
});

// =====================
// LOAD ROUTES
// =====================
console.log("🔥 Loading user routes...");
const userRoutes = require("./routes/userRoutes");

app.use("/api/users", userRoutes);

// =====================
// ROOT
// =====================
app.get("/", (req, res) => {
  res.send("API WORKING ✅");
});

// =====================
// HEALTH
// =====================
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// =====================
// DATABASE
// =====================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("DB ERROR:", err));

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});