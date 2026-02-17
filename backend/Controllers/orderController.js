const mongoose = require("mongoose");
const Order = require("../Models/order");
const User = require("../Models/user");
const Product = require("../Models/product");

exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.id;
    const { items, shippingInfo, payment, totalAmount } = req.body;

    const formattedItems = items.map((item) => ({
      productId: item._id,
      name: item.name,
      image: item.image,
      size: item.size,
      price: item.price,
      quantity: item.quantity,
    }));

    for (const item of formattedItems) {
      const product = await Product.findById(item.productId).session(session);

      if (!product) {
        throw new Error("Product not found");
      }

      const sizeEntry = product.sizes.find(
        (s) => s.size === item.size
      );

      if (!sizeEntry) {
        throw new Error(`Size ${item.size} not available`);
      }

      if (sizeEntry.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for ${product.name} (${item.size})`
        );
      }

      sizeEntry.stock -= item.quantity;

      await product.save({ session });
    }

    const order = await Order.create(
      [
        {
          userId,
          items: formattedItems,
          shippingInfo,
          payment,
          totalAmount,
        },
      ],
      { session }
    );

    await User.findByIdAndUpdate(
      userId,
      {
        $push: { orders: order[0]._id },
        $set: { cart: [] },
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(order[0]);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error("CREATE ORDER ERROR ", err);
    res.status(400).json({
      message: err.message || "Failed to create order",
    });
  }
};

exports.getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId)
            .populate("items.productId", "name images");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(order);
    } catch (err) {
        console.error("GET ORDER ERROR ", err);
        res.status(500).json({ message: "Failed to fetch order" });
    }
};