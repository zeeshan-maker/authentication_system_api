const User = require("../models/User");
const { sendEmail } = require("../utils/emailSender")
const crypto = require("crypto");

exports.createUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existing = await User.findOne({ where: { email: email } });
        if (existing)
            return res.status(400)
                .json({
                    status: 400,
                    message: "Email already in use."
                });
        const token = crypto.randomBytes(32).toString("hex");
        await User.create({
            name: name
            , email: email,
            password: password,
            resetToken: token
        });

        res.status(201)
            .json({
                status: 201,
                message: "Registration successful. Please Check your email to verify your account."
            });
        const link = `http://localhost:4000/api/v1/auth/verify-user/${token}`;
        await sendEmail(
            email,
            "Use This Link to Activate Your Account",
            `Please verify your account.`,
            `<p>Click to verify: <a href="${link}">${link}</a></p>`,
        )
    }
    catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Registration failed",
            error: error.message
        })
    }

}
