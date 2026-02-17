// Routers/productRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("../Controllers/productController");

// router.get("/getProducts", productController.getAllProducts);
router.get("/getProducts/:category", productController.getProductsByCategory);

router.get("/getProductInfo/:productId", productController.getProduct);

module.exports = router;
