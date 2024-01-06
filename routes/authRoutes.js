const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const loginLimiter = require("../middleware/loginLimiter");

router.route("/").post(loginLimiter, authController.handleLogin);

router.route("/pops").get(authController.handleRefreshToken);

router.route("/logout").post(authController.handleLogout);

module.exports = router;
