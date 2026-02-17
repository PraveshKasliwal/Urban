const express = require("express");
const router = express.Router();

const isAuth = require("../Middleware/isAuth");
const cartController = require("../Controllers/cartController");

router.post("/add", isAuth, cartController.addToCart);
router.get("/", isAuth, cartController.getCart);
router.post("/remove", isAuth, cartController.removeFromCart);

router.post("/increase", isAuth, cartController.increaseQuantity);
router.post("/decrease", isAuth, cartController.decreaseQuantity);


module.exports = router;