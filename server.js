require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// =====================
app.use(cors());
app.use(express.json());

// =====================
// ROUTES (IMPORTANT)
// =====================
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const loanRoutes = require("./routes/loanRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/dashboard", dashboardRoutes);

// =====================
app.get("/", (req, res) => {
  res.send("API working 🚀");
});

// =====================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});