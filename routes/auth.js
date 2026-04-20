require("dotenv").config();
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// =====================
// REGISTER
// =====================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json("User already exists");
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // create user
    const user = new User({
      name,
      email,
      password: hashed,
      isAdmin: false, // default
    });

    await user.save();

    res.json("User registered successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

// =====================
// LOGIN (FIXED ✅)
// =====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("User not found");

    // 2. check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json("Wrong password");

    // 3. CREATE JWT TOKEN ✅ (IMPORTANT)
    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin, // ⭐ THIS FIXES YOUR ISSUE
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4. SEND RESPONSE
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;