import Replicate from "replicate";
const replicate = new Replicate();

export const getEmbedding = async (text) => {
  const output = await replicate.run("beautyyuyanli/multilingual-e5-large:a06276a89f1a902d5fc225a9ca32b6e8e6292b7f3b136518878da97c458e2bad", { input: { text } });

  const vector = output[0];

  if (!Array.isArray(vector) || vector.length !== 1024) {
    throw new Error(`Invalid embedding received. Expected 1024 dimensions, got: ${vector?.length}`);
  }

  return vector;
};