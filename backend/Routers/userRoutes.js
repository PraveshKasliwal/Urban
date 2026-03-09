const express = require("express");
const router = express.Router();
const isAuth = require("../Middleware/isAuth");
const userController = require("../Controllers/userController");

router.get("/getUserDetail", isAuth, userController.getUserProfile);

module.exports = router;
