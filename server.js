require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// =====================
// SOCKET.IO
// =====================
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// attach io to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// socket connection
io.on("connection", (socket) => {
  console.log("🔥 User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json());

// =====================
// SERVE FRONTEND (FIXED)
// =====================
app.use(express.static(path.join(__dirname, "public")));

// fallback route for frontend (SPA support)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// =====================
// ROUTES
// =====================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/loans", require("./routes/loanRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// =====================
// HEALTH CHECK
// =====================
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    time: new Date(),
  });
});

// =====================
// DATABASE
// =====================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("DB ERROR:", err));

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});