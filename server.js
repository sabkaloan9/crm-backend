const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(cors({ origin: "*" }));
app.use(express.json());

// =====================
// ROOT ROUTE
// =====================
app.get("/", (req, res) => {
  res.send("CRM Backend is LIVE 🚀");
});

// =====================
// ROUTES
// =====================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/loans", require("./routes/loanRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// =====================
// DB CONNECTION
// =====================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => {
    console.error("DB connection error ❌", err.message);
    process.exit(1);
  });

// =====================
// ERROR HANDLER
// =====================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error" });
});

// =====================
// PORT
// =====================
const PORT = process.env.PORT || 5000;

// =====================
// START SERVER
// =====================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} ✅`);
});