import { GoogleGenAI } from "@google/genai";
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

    const promptEmbedding = await getEmbedding(prompt);

    const products = await Product.aggregate([
      {
        $vectorSearch: {
          index: "productvectorindex",
          path: "embedding",
          queryVector: promptEmbedding,
          numCandidates: 100,
          limit: 6,
        },
      },
      {
        $project: {
          name: 1,
          price: 1,
          images: 1,
          colors: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ]);

    res.status(200).json(products);
  } catch (err) {
    console.error("VECTOR SEARCH ERROR ", err);
    res.status(500).json({ message: "Vector search failed" });
  }
};