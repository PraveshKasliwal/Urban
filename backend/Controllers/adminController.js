const Product = require("../Models/product");
const downloadImage = require("../utils/downloadImage");
const s3Uploader = require("../utils/s3Uploader");
const { deleteFromS3 } = require("../utils/s3");
const { getEmbedding } = require("../utils/embedding");

exports.createProduct = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    let sizes = [];
    let colors = [];

    try {
      sizes = req.body.sizes ? JSON.parse(req.body.sizes) : [];
      colors = req.body.colors ? JSON.parse(req.body.colors) : [];
    } catch (err) {
      return res.status(400).json({ message: "Invalid sizes or colors format" });
    }

    if (!Array.isArray(sizes) || sizes.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one size with stock is required" });
    }

    for (const s of sizes) {
      if (!s.size || typeof s.stock !== "number" || s.stock < 0) {
        return res.status(400).json({
          message: "Each size must have a valid size and non-negative stock",
        });
      }
    }

    const imageUrls = req.files.map((file) => file.location);

    const searchText = `
          ${req.body.name}.
          Category: ${req.body.category}.
          Colors: ${colors?.join(", ")}.
          Material: ${req.body.material}.
          Sizes: ${sizes?.map(s => s.size).join(", ")}.
          Description: ${req.body.description}.
          `;

    const embedding = await getEmbedding(searchText);

    // Create product
    const product = await Product.create({
      name: req.body.name?.trim(),
      price: Number(req.body.price),
      category: req.body.category,
      material: req.body.material,
      description: req.body.description,
      sizes,
      colors,
      images: imageUrls,
      searchText,
      embedding,
      isActive: true,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    console.error("CREATE PRODUCT ERROR :", err);
    res.status(500).json({ message: "Failed to create product" });
  }
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

exports.bulkAddProducts = async (req, res) => {
  try {
    const products = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({ message: "Invalid JSON format" });
    }

    const createdProducts = [];

    for (let i = 0; i < products.length; i++) {
      const item = products[i];

      console.log(`📦 Processing product ${i + 1}/${products.length}`);

      const tempPath = await downloadImage(
        item.imageUrl,
        `${Date.now()}-${i}.jpg`
      );

      const s3Url = await s3Uploader(tempPath);

      const searchText = `
        ${item.name}.
        Category: ${item.category}.
        Colors: ${item.colors.join(", ")}.
        Material: ${item.material}.
        Sizes: ${item.sizes.map(s => s.size).join(", ")}.
        Description: ${item.description}.
      `;

      const embedding = await getEmbedding(searchText);

      const product = await Product.create({
        name: item.name,
        price: item.price,
        category: item.category,
        material: item.material,
        description: item.description,
        sizes: item.sizes,
        colors: item.colors,
        images: [s3Url],
        searchText,
        embedding,
        isActive: true,
      });

      createdProducts.push(product);

      if (i < products.length - 1) {
        console.log("⏳ Waiting 2.5 seconds before next embedding...");
        await sleep(2500);
      }
    }

    res.status(201).json({
      message: "Bulk upload completed safely",
      count: createdProducts.length,
    });
  } catch (err) {
    console.error("BULK ADD ERROR ", err);
    res.status(500).json({ message: "Bulk upload failed" });
  }
};

exports.getAdminProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("_id name images sizes"),
      Product.countDocuments(),
    ]);

    const formatted = products.map((p) => ({
      _id: p._id,
      name: p.name,
      images: p.images,
      totalStock: p.sizes.reduce((sum, s) => sum + s.stock, 0),
    }));

    res.status(200).json({
      products: formatted,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error("ADMIN FETCH PRODUCTS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.images?.length) {
      await Promise.all(
        product.images.map((url) => deleteFromS3(url))
      );
    }

    await Product.findByIdAndDelete(productId);

    res.status(200).json({ message: "Product and images deleted" });
  } catch (err) {
    console.error("DELETE PRODUCT ERROR ", err);
    res.status(500).json({ message: "Delete failed" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("GET PRODUCT ERROR :", error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

// 🔹 UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      material,
      sizes,
      colors,
      isActive,
    } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        category,
        material,
        sizes,    // [{ size, stock }]
        colors,
        isActive,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR :", error);
    res.status(500).json({ message: "Failed to update product" });
  }
};