require("dotenv").config();
const jwt = require("jsonwebtoken");

// =====================
// AUTH MIDDLEWARE
// =====================
function auth(req, res, next) {
  const token = req.headers.token;

  console.log("🔐 TOKEN RECEIVED:", token);
  console.log("🔐 VERIFY SECRET:", process.env.JWT_SECRET);

  if (!token) {
    console.log("❌ NO TOKEN");
    return res.status(401).json("No token");
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    console.log("✅ TOKEN VERIFIED:", verified);

    req.user = verified; // { id, isAdmin }

    next();

  } catch (err) {
    console.log("❌ TOKEN ERROR:", err.message);
    return res.status(401).json("Invalid token");
  }
}

module.exports = auth;