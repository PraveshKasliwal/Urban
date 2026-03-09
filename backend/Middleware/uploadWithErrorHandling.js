const uploader = require("../utils/s3-uploader");

const uploadImages = (req, res, next) => {
  uploader.array("images", 5)(req, res, (err) => {
    if (err) {
      console.error("MULTER / S3 ERROR :", err);
      return res.status(500).json({
        message: "File upload failed",
        error: err.message,
      });
    }
    next();
  });
};

module.exports = uploadImages;