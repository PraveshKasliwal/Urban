const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = async function downloadImage(url, filename) {
  const dir = path.join(__dirname, "../tmp");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  const filePath = path.join(dir, filename);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  await new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(filePath);
    response.data.pipe(stream);
    stream.on("finish", resolve);
    stream.on("error", reject);
  });

  return filePath;
};