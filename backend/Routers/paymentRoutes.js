const express = require("express");
const router = express.Router();
const isAuth = require("../Middleware/isAuth");
const paymentController = require("../Controllers/paymentController");

router.post("/create-order", isAuth, paymentController.createOrder);
router.post("/verify", isAuth, paymentController.verifyPayment);

module.exports = router;