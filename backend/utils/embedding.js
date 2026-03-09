import Replicate from "replicate";
const replicate = new Replicate();

export const getEmbedding = async (text) => {
  const output = await replicate.run(
    "replicate/all-mpnet-base-v2:b6b7585c9640cd7a9572c6e129c9549d79c9c31f0d3fdce7baac7c67ca38f305",
    {
      input: { text },
    }
  );

  // 1. Extract the actual vector from the first element of the array
  const vector = output[0]?.embedding;

  // 2. Validate that we actually got an array of numbers
  if (!Array.isArray(vector) || vector.length !== 768) {
    throw new Error(`Invalid embedding received. Expected 768 dimensions, got: ${vector?.length}`);
  }

  return vector;
};