const router = require("express").Router();

/* BROWSER TEST (GET) */
router.get("/register", (req, res) => {
  res.send("REGISTER WORKING IN BROWSER ✅");
});

/* KEEP LOGIN (optional) */
router.post("/login", (req, res) => {
  res.json({ message: "LOGIN WORKING ✅" });
});

module.exports = router;