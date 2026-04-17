require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const loanRoutes = require("./routes/loanRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// =======================
// MIDDLEWARE
// =======================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// CONNECT DB
// =======================
connectDB();

// =======================
// API ROUTES
// =======================
app.use("/api/users", userRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/dashboard", dashboardRoutes);

// =======================
// FRONTEND
// =======================
app.use(express.static(path.join(__dirname, "public")));

// =======================
// HOME ROUTE
// =======================
app.get("/", (req, res) => {
  res.send("CRM Running 🚀");
});

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} ✅`);
});