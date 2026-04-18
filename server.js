const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ======================
// MIDDLEWARE
// ======================
app.use(express.json());
app.use(cors()); // allow all origins

// ======================
// ROOT ROUTE (IMPORTANT)
// ======================
app.get("/", (req, res) => {
  res.send("🚀 API is running");
});

// ======================
// ROUTES
// ======================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/loans", require("./routes/loanRoutes"));

// ======================
// DB CONNECTION
// ======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ DB Error:", err.message);
    process.exit(1);
  });

// ======================
// SERVER START
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});