const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Check kore user login kora ache kina (Token valid kina)
const protect = async (req, res, next) => {
    let token;

    // Cookie theke token neya hocche
    token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
};

// Role check korar jonno (jemon shudhu admin ei route e dhukte parbe)
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Role '${req.user.role}' is not allowed to access this resource`,
            });
        }
        next();
    };
};

module.exports = { protect, authorize };


/*
এইটা কী কাজ করে: protect function চেক করবে user login করা আছে কিনা (Cookie-তে valid token আছে কিনা)। authorize function চেক করবে user-এর role অনুযায়ী (admin/agent/user) সে ওই route access করতে পারবে কিনা।
*/