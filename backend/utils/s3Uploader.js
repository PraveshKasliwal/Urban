const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

module.exports = async function s3Uploader(filePath, folder = "products") {
  const fileContent = await fs.promises.readFile(filePath);

  const fileName = `${folder}/${Date.now()}-${path.basename(filePath)}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME, // ✅ SAME AS MULTER
    Key: fileName,
    Body: fileContent,
    ContentType: mime.lookup(filePath) || "application/octet-stream",
    // ACL: "public-read", // keep if bucket allows ACL
  };

  const uploadResult = await s3.upload(params).promise();

  await fs.promises.unlink(filePath);

  return uploadResult.Location;
};