const { unlink } = require("fs/promises");
const multer = require("multer");
const ALLOWED_EXTENSIONS = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};
const path = require("path");

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, "public/uploads");
  },
  filename: function (_, file, cb) {
    const fileName = file.originalname
      .replace(" ", "-")
      .replace(".png", "")
      .replace(".jpg", "")
      .replace("jpeg", "");
    const extension = ALLOWED_EXTENSIONS[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

exports.upload = multer({
  storage: storage,
  limits: { fieldSize: 1024 * 1024 * 5 },
  fileFilter: (_, file, cb) => {
    const isValid = ALLOWED_EXTENSIONS[file.mimetype];
    let uploadError = new Error(
      `Invalid image type\n${file.mimetype} is not allowed`
    );
    if (isValid) return cb(uploadError);
    return cb(null, true);
  },
});

exports.deleteImages = async function (imageUrls, continueOnErrorName) {
  await Promise.all(
    imageUrls.map(async (imageUrl) => {
      const imagePath = path.resolve(
        __dirname,
        "..",
        "public",
        "uploads",
        path.basename(imageUrl)
      );
      try {
        await unlink(imagePath);
      } catch (error) {
        if (error.code === continueOnErrorName) {
          console.error(`Continuing with the next images: ${error.message}`);
        } else {
          console.error(`Error deleting images: ${error.message}`);
        }
      }
    })
  );
};
