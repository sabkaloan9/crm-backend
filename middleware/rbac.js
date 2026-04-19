module.exports = {
  // 👑 ROLE CHECK
  requireRole: (roles = []) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Role not allowed" });
      }

      next();
    };
  },

  // 🔐 PERMISSION CHECK
  requirePermission: (permissions = []) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const hasPermission = permissions.every(p =>
        req.user.permissions.includes(p)
      );

      if (!hasPermission) {
        return res.status(403).json({ message: "Permission denied" });
      }

      next();
    };
  }
};