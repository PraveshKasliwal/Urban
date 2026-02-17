const Product = require("../Models/product");

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        console.error("FETCH PRODUCTS ERROR :", error);
        res.status(500).json({ message: "Failed to fetch products" });
    }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    let { category } = req.params;
    let { minPrice, maxPrice, sizes, colors } = req.query;

    category =
      category.charAt(0).toUpperCase() +
      category.slice(1).toLowerCase();

    const baseQuery = { category };
    const filteredQuery = { category };

    if (minPrice && maxPrice) {
      filteredQuery.price = {
        $gte: Number(minPrice),
        $lte: Number(maxPrice),
      };
    }

    if (sizes) {
      filteredQuery.sizes = {
        $elemMatch: {
          size: { $in: sizes.split(",") },
          stock: { $gt: 0 },
        },
      };
    }

    if (colors) {
      filteredQuery.colors = { $in: colors.split(",") };
    }

    const [products, allCategoryProducts] = await Promise.all([
      Product.find(filteredQuery),
      Product.find(baseQuery),
    ]);

    const availableColors = [
      ...new Set(allCategoryProducts.flatMap((p) => p.colors)),
    ];

    res.status(200).json({
      products,
      availableColors,
    });
  } catch (error) {
    console.error("FILTER PRODUCTS ERROR :", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ FILTER OUT SIZES WITH STOCK = 0
    // if (Array.isArray(product.sizes)) {
    //   product.sizes = product.sizes.filter(
    //     (s) => s.stock && s.stock > 0
    //   );
    // }

    res.status(200).json(product);
  } catch (error) {
    console.error("GET PRODUCT ERROR :", error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};
