const express = require("express");

const router = express.Router();

const productController = require("../controller/product");
const reviewsController = require("../controller/reviews");

router.get("/", productController.getProducts);
router.get("/search", productController.searchProduct);
router.get("/:id", productController.getProductById);
router.post("/:id/reviews", reviewsController.leaveReview);
router.get("/:id/reviews", reviewsController.getProductReviews);

module.exports = router;
