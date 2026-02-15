// External Module
const express = require("express");
const authRouter = express.Router();

// Local Module
const authController = require("../controllers/authController");
const { loginLimiter, signupLimiter } = require("../middleware/rateLimiter");
const isAuth = require("../utils/isAuth");

authRouter.get("/login", authController.getLogin);
authRouter.post("/login", loginLimiter, authController.postLogin);
authRouter.post("/logout", authController.postLogout);
authRouter.get("/signup", authController.getSignup);
authRouter.post("/signup", signupLimiter, authController.postSignup);
authRouter.get("/status", isAuth, authController.getAuthStatus);

module.exports = authRouter;
