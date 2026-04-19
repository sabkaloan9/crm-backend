const User = require("../models/User");
const bcrypt = require("bcryptjs");

/* =========================
   CREATE USER (ADMIN ONLY SAFE)
========================= */
const createUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // 🔐 BASIC VALIDATION
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required"
      });
    }

    // 🚫 PREVENT ROLE SPOOFING (VERY IMPORTANT)
    const safeRole = req.user?.role === "superadmin" ? role || "user" : "user";

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: safeRole
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.log("CREATE USER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET ALL USERS (SAAS SAFE)
========================= */
const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   DELETE USER (ADMIN ONLY SAFE)
========================= */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // 🚫 PREVENT SELF DELETE (optional safety)
    if (req.user.id === id) {
      return res.status(400).json({
        message: "You cannot delete yourself"
      });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({ message: "User deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createUser,
  getUsers,
  deleteUser
};