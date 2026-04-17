module.exports = function (roles = []) {
  return (req, res, next) => {
    try {
      // role comes from JWT (auth middleware)
      const userRole = req.user.role;

      if (!roles.includes(userRole)) {
        return res.status(403).json({
          message: "Access denied: insufficient permissions"
        });
      }

      next();

    } catch (err) {
      res.status(500).json({ message: "Role check failed" });
    }
  };
};