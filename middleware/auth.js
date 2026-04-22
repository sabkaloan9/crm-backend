const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.headers.token;

  if (!token) return res.status(401).json("No token");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch {
    res.status(401).json("Invalid token");
  }
};