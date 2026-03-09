const express = require("express");
const router = express.Router();

const isAuth = require("../Middleware/isAuth");
const isAdmin = require("../Middleware/isAdmin");
const adminController = require("../Controllers/adminController");
const uploadImages = require("../Middleware/uploadWithErrorHandling");

router.post(
  "/addProduct",
  isAuth,
  isAdmin,
  uploadImages,
  adminController.createProduct
);

router.get(
  "/products",
  isAuth,
  isAdmin,
  adminController.getAdminProducts
);

router.delete(
  "/product/:productId",
  isAuth,
  isAdmin,
  adminController.deleteProduct
);

router.get(
  "/product/:id",
  isAuth,
  isAdmin,
  adminController.getProductById
);

// 🔹 update product
router.put(
  "/product/:id",
  isAuth,
  isAdmin,
  adminController.updateProduct
);

router.post("/bulkAdd", isAuth, isAdmin, adminController.bulkAddProducts);

module.exports = router;
