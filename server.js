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

// attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  console.log("🔥 User connected:", socket.id);
});

// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json());

// =====================
// TEST ROUTES
// =====================
app.get("/", (req, res) => {
  res.send("API WORKING ✅");
});

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// =====================
// ROUTES
// =====================
app.use("/api/users", require("./routes/userRoutes"));

// =====================
// DATABASE
// =====================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});