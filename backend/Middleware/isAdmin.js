const User = require('../Models/user');
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== "admin") return res.status(403).json({ message: "Access Denied" });
        next();
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = isAdmin;