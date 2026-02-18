const express = require("express");
const router = express.Router();
const isAuth = require("../Middleware/isAuth");
const orderController = require("../Controllers/orderController");

router.post("/create", isAuth, orderController.createOrder);
// router.get("/:orderId", isAuth, orderController.getOrderById);
router.get("/my-orders", isAuth, orderController.getUserOrders);

module.exports = router;
