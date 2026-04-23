require("dotenv").config();
const express = require("express");

const app = express();

app.use(express.json());

// =====================
// START LOG (VERY IMPORTANT)
// =====================
console.log("🔥 NEW VERSION DEPLOYED");

// =====================
// ROUTES
// =====================

// ROOT (deployment check)
app.get("/", (req, res) => {
  res.send("NEW VERSION LIVE 🚀");
});

// TEST
app.get("/test", (req, res) => {
  res.send("TEST WORKING ✅");
});

// HEALTH
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    time: new Date().toISOString(),
  });
});

// DEBUG: catch all routes
app.use((req, res) => {
  res.status(200).send("YOU HIT: " + req.originalUrl);
});

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("🚀 Running on port " + PORT);
});