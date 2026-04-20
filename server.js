require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

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
  },
});

// attach io
app.use((req, res, next) => {
  req.io = io;
  next();
});

// socket connection log
io.on("connection", (socket) => {
  console.log("🔥 User connected:", socket.id);
});

// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json());

// ✅ SERVE FRONTEND (CRITICAL FIX)
app.use(express.static("public"));

// =====================
// ROUTES
// =====================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/loans", require("./routes/loanRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// =====================
// TEST ROUTE
// =====================
app.get("/", (req, res) => {
  res.send("API running 🚀");
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