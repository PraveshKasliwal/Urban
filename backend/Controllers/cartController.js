const User = require("../Models/user");
const Product = require("../Models/product");

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, size, quantity = 1 } = req.body;

    const user = await User.findById(userId);

    const existingItem = user.cart.find(
      (item) =>
        item.productId.toString() === productId && item.size === size
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ productId, size, quantity });
    }

    await user.save();
    res.status(200).json(user.cart);
  } catch (err) {
    console.error("ADD TO CART ERROR :", err);
    res.status(500).json({ message: "Failed to add to cart" });
  }
};


exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();

    if (!user || !user.cart) {
      return res.status(200).json([]);
    }

    const productIds = user.cart.map(item => item.productId);

    const products = await Product.find({
      _id: { $in: productIds }
    }).lean();

    const productMap = {};
    products.forEach(p => {
      productMap[p._id.toString()] = p;
    });

    const cartResponse = user.cart
      .map(item => {
        const product = productMap[item.productId.toString()];
        if (!product) return null;

        return {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0],
          size: item.size,
          quantity: item.quantity,
        };
      })
      .filter(Boolean);

    res.status(200).json(cartResponse);
  } catch (err) {
    console.error("GET CART ERROR :", err);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId, size } = req.body;
    const user = await User.findById(req.user.id);

    user.cart = user.cart.filter(
      (item) =>
        !(
          item.productId.toString() === productId &&
          item.size === size
        )
    );

    await user.save();
    res.status(200).json(user.cart);
  } catch (err) {
    console.error("REMOVE CART ERROR :", err);
    res.status(500).json({ message: "Failed to remove item" });
  }
};

exports.increaseQuantity = async (req, res) => {
  try {
    const { productId, size } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const item = user.cart.find(
      (i) => i.productId.toString() === productId && i.size === size
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity += 1;

    await user.save();
    res.status(200).json(user.cart);
  } catch (err) {
    console.error("INCREASE QTY ERROR ", err);
    res.status(500).json({ message: "Failed to increase quantity" });
  }
};


exports.decreaseQuantity = async (req, res) => {
  try {
    const { productId, size } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const itemIndex = user.cart.findIndex(
      (i) => i.productId.toString() === productId && i.size === size
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (user.cart[itemIndex].quantity > 1) {
      user.cart[itemIndex].quantity -= 1;
    } else {
      user.cart.splice(itemIndex, 1);
    }

    await user.save();
    res.status(200).json(user.cart);
  } catch (err) {
    console.error("DECREASE QTY ERROR ", err);
    res.status(500).json({ message: "Failed to decrease quantity" });
  }
};
