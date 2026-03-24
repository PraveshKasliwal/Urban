import { getEmbedding } from "../utils/embedding.js";
import Product from "../Models/product.js";

import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export const generateStyleImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim().length < 5) {
      return res.status(400).json({ message: "Prompt too short" });
    }

    const fashionPrompt = `
      High-end fashion editorial photoshoot.
Subject: Only generate the clothing item(s) explicitly mentioned in "${prompt}". 
Do NOT add extra garments or accessories.
Ultra-realistic clothing textures, studio lighting, neutral background, premium fashion catalog quality.
Only the specified item(s) should be visible and clearly framed.
`;

    const input = {
      prompt: fashionPrompt,
      image_input: [],
      aspect_ratio: "match_input_image",
      output_format: "jpg"
    };

    const output = await replicate.run("google/gemini-2.5-flash-image", { input });
    if (!output || !output.url) {
      throw new Error("Invalid output from image generation model");
    }
    const fileUrl = output.url(); // This is the URL to the generated image

    res.status(200).json({
      image: fileUrl,
    });
  } catch (error) {
    console.error("STYLE STUDIO IMAGE ERROR ", error);
    res.status(500).json({ message: "Failed to generate image" });
  }
};

export const searchByPrompt = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const enrichedPrompt = `${prompt} fashion clothing outfit`;
    const promptEmbedding = await getEmbedding(enrichedPrompt);

    // Run vector search and keyword search in parallel
    const [vectorResults, keywordResults] = await Promise.all([

      // Vector search — semantic similarity
      Product.aggregate([
        {
          $vectorSearch: {
            index: "productvectorindex",
            path: "embedding",
            queryVector: promptEmbedding,
            numCandidates: 150,
            limit: 12,
          },
        },
        {
          $project: {
            name: 1, price: 1, images: 1, colors: 1,
            vectorScore: { $meta: "vectorSearchScore" },
          },
        },
      ]),

      // Keyword search — exact term matching
      Product.find(
        { $text: { $search: prompt }, isActive: true },
        { name: 1, price: 1, images: 1, colors: 1, textScore: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" } })
        .limit(12)
        .lean(),
    ]);

    // Merge results — products in both lists get a boost
    const scoreMap = new Map();

    // Add vector results with normalized score
    for (const p of vectorResults) {
      scoreMap.set(p._id.toString(), {
        ...p,
        finalScore: p.vectorScore,
      });
    }

    // Add keyword results — boost if already in vector results
    for (const p of keywordResults) {
      const id = p._id.toString();
      const normalizedTextScore = Math.min(p.textScore / 10, 1); // normalize to 0-1

      if (scoreMap.has(id)) {
        // Appeared in both — boost score
        const existing = scoreMap.get(id);
        existing.finalScore = existing.vectorScore * 0.7 + normalizedTextScore * 0.3 + 0.1;
      } else {
        // Keyword only
        scoreMap.set(id, {
          ...p,
          finalScore: normalizedTextScore * 0.6,
        });
      }
    }

    // Sort by final score, take top 6, strip score before sending
    const merged = Array.from(scoreMap.values())
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, 6)
      .map(({ finalScore, vectorScore, textScore, ...product }) => product);

    res.status(200).json(merged);
  } catch (err) {
    console.error("VECTOR SEARCH ERROR ", err);
    res.status(500).json({ message: "Vector search failed" });
  }
};