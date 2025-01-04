const authorizeSuperAdmin = async (req, res, next) => {
    const userId = req.user.userId;
  
    try {
      const user = await User.findByPk(userId, { include: [Role] });
      if (!user || !user.Roles.some(role => role.name === "super_admin")) {
        return res.status(403).json({ message: "You are not authorized to perform this action." });
      }
  
      next();
    } catch (error) {
      res.status(500).json({ message: "Error checking authorization.", error });
    }
  };
  
  module.exports = { authorizeSuperAdmin };