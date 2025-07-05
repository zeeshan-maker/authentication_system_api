const express = require("express");
const router= express.Router();
const userController= require("../controllers/authController");
const authenticate = require("../middleware/authMiddleware");

router.post("/login",userController?.login);
router.post("/logout",userController?.logout);
router.get("/verify-user/:token", userController?.verifyUser);
router.post("/forgot-password", userController?.forgotPassword);
router.post("/reset-password/:token",userController?.resetPassword);
router.post("/refresh-token",userController?.refreshToken);
router.get("/me",authenticate,userController?.getUser);

module.exports= router;