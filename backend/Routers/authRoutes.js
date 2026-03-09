const express = require('express');
const router = express.Router();
const authController = require("../Controllers/authController");

router.post("/login", authController.login);
router.post("/register-user", authController.registerUser);

module.exports = router;