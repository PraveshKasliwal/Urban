import "dotenv/config";
import mongoose from "mongoose";
import Product from "../Models/product.js";
import { getEmbedding } from "../utils/embedding.js";

const START_INDEX = 3; // 👈 start from product 3
const WAIT_TIME_MS = 60 * 1000; // ⏱ 1 minute

await mongoose.connect(process.env.MONGO_URI);

const products = await Product.find();

console.log(`🔁 Re-embedding ${products.length} products`);
console.log(`▶️ Starting from index ${START_INDEX} (product ${START_INDEX + 1})`);
console.log(`⏳ Waiting ${WAIT_TIME_MS / 1000}s between each product\n`);

for (let i = START_INDEX; i < products.length; i++) {
  const p = products[i];

  console.log(`🚀 STARTING product ${i + 1}/${products.length}`);
  console.log(`🆔 Product ID: ${p._id}`);

  const searchText = `
    ${p.name}.
    Category: ${p.category}.
    Colors: ${p.colors.join(", ")}.
    Material: ${p.material}.
    Sizes: ${p.sizes.map((s) => s.size).join(", ")}.
    Description: ${p.description || ""}.
  `;

  const embedding = await getEmbedding(searchText);

  await Product.updateOne(
    { _id: p._id },
    { $set: { embedding } }
  );

  console.log(`✅ COMPLETED product ${i + 1}/${products.length}`);

  if (i < products.length - 1) {
    console.log(`⏱ TIMER STARTED (waiting 60 seconds...)`);
    await new Promise((r) => setTimeout(r, WAIT_TIME_MS));
    console.log(`⏱ TIMER ENDED\n`);
  }
}

console.log("🎉 Re-embedding completed successfully");
process.exit();