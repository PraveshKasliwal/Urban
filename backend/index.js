require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./Routers/authRoutes");
const adminRoutes = require("./Routers/adminRoutes");
const productRoutes = require("./Routers/productRoutes");
const cartRoutes = require("./Routers/cartRoutes");
const paymentRoutes = require("./Routers/paymentRoutes");
const orderRoutes = require("./Routers/orderRoutes");
const styleStudioController = require("./Routers/styleStudioRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/style", styleStudioController);

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({ message: err.message || "Server error" });
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to DB");
    app.listen(process.env.PORT);
  })
  .catch(console.log);