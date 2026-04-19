module.exports = function (roles = []) {
  return (req, res, next) => {
    try {
      // 🔐 1. MUST HAVE USER (auth safety layer)
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // 👑 2. SUPERADMIN ALWAYS ALLOWED (enterprise override)
      if (req.user.role === "superadmin") {
        return next();
      }

      // 🧠 3. ROLE CHECK
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Access denied (role restriction)"
        });
      }

      next();

    } catch (err) {
      return res.status(500).json({
        message: "RBAC middleware error"
      });
    }
  };
};