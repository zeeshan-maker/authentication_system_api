const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ status: 401, message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next()
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ status: 401, message: "Token expired" });
        }
            return res.status(403).json({ status: 403, message: "Invalid or expired token" })
        }
    }


    module.exports = authenticate