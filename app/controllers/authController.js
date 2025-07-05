const User = require("../models/User");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/emailSender")
require("dotenv").config();
const generateTokens = require("../utils/generateTokens")


exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user)
            return res.status(404).json({
                status: 404,
                message: "User not found."
            })

        // Verify the password
        const isPasswordValid = password === user.password;
        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ status: 401, message: "Invalid credentials" });
        }

        if (!user.isVerified) {
            const token = user.resetToken;
             res.status(401).json({ status: 401, message: "Please verify your email first" })
            const link = `http://localhost:4000/api/v1/auth/verify-user/${token}`;
            await sendEmail(
                email,
                "Use This Link to Activate Your Account",
                "Please verify your account.",
                `<p>Click to verify: <a href="${link}">${link}</a></p>`,
            );
            return;
        }


        // Generate Tokens
        const tokens = generateTokens(user);
        user.refreshToken = tokens.refreshToken;
        await user.save();

        return res.status(200).json({
            status: 200,
            message: "Login successfully",
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: { name: user.name, email: user.email }
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Login failed",
            error: error.message
        })
    }
}

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken)
        return res.status(401).json({ status: 401, message: "Refresh token missing" });

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findByPk(decoded.user_id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ status: 403, message: "Invalid or expired refresh token" });
        }

        // Generate new tokens
        const tokens = generateTokens(user);
        user.refreshToken = tokens.refreshToken;
        await user.save();

        return res.status(200).json({
            status: 200,
            message: "New access token issued",
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        });
    }
    catch (error) {
        return res.status(403).json({
            status: 403,
            message: "Refresh token invalid or expired",
            error: error.message
        });
    }


}


exports.logout = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });

    try {
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await User.findByPk(decoded.user_id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ status: 403, message: 'Invalid token or user not found' });
        }

        // Clear refresh token from DB
        user.refreshToken = null;
        await user.save();
        res.status(200).json({ status: 200, message: 'Logged out successfully' });

    } catch (error) {
        return res.status(500).json({
            status: 500,
            error: error.message
        });
    }
}

exports.verifyUser = async (req, res) => {
    const token = req.params.token;
    try {
        const user = await User.findOne({ where: { resetToken: token } });
        if (!user) return res.status(400).json({
            status: 400,
            message: "Invalid or expired token"
        });

        user.isVerified = true;
        user.resetToken = null;
        await user.save();
        return res.status(200).json({
            status: 200,
            message: "Email verified successfully!"
        });

    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Server error",
            error: error.message
        });
    }
}


exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email: email } });
        if (!user) return res.status(404).json({ message: "User not found" });
        const token = crypto.randomBytes(32).toString("hex");
        user.resetToken = token;
        await user.save();

        // Create frontend link
        const resetLink = `http://localhost:3000/reset-password/${token}`;
        await sendEmail(
            email,
            "Reset Your Password",
            `We received a request to reset your password. Click the button below to set a new password`,
            `<p style="text-align: center;">
                 <a href="{${resetLink}}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a>
            </p>
            <p>${resetLink}</p>`,
        )

        return res.status(200).json({ message: "Reset link sent to email" });

    } catch (error) {
        return res.status(500).json({
            status: 500,
            error: error.message
        });
    }
}


exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({ where: { resetToken: token } });
        if (!user) return res.status(400).json({ message: "Invalid or expired token" });
        user.password = password;
        user.resetToken = null;
        await user.save();
        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        return res.status(500).json({ status: 500, serror: error.message });
    }
}


exports.getUser = async (req, res)=>{
    const user_id =req.user.user_id;
   try {
     const user = await User.findByPk(user_id);
     if (!user) return res.status(404).json({ status:404, message: 'User not found' });
     return res.status(200).json({status:200, user: { name: user.name, email: user.email } });
   } 
   catch (error) {
        return res.status(500).json({ status: 500, serror: error.message });
   }    
}