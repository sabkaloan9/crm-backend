require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json());

// =====================
// ROUTES
// =====================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/loans", require("./routes/loanRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// =====================
// ROOT ROUTE (IMPORTANT)
// =====================
app.get("/", (req, res) => {
  res.send("🚀 CRM Backend Running");
});

// =====================
// STATIC FRONTEND (OPTIONAL)
// =====================
app.use(express.static(path.join(__dirname, "frontend")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// =====================
// DB CONNECT
// =====================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("DB Error ❌", err));

// =====================
// SERVER START
// =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} ✅`);
});