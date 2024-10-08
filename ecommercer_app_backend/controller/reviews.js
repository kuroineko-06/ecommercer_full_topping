const { default: mongoose } = require("mongoose");
const { Product } = require("../models/product");
const { Review } = require("../models/review");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");

exports.leaveReview = async function (req, res) {
  try {
    const user = User.findById(req.body.user);
    if (!user) {
      return res.status(404).json({ message: "Invalid user!" });
    }
    const review = await new Review({
      ...req.body,
      user: user.name,
    }).save();

    if (!review) {
      return res
        .status(400)
        .json({ message: "The review could not be added!" });
    }
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: " Product not found!" });
    }
    product.reviews.push(review.id);
    product = await product.save();
    if (!product) {
      return res.status(500).json({ message: " Internal Server Error" });
    }
    return res.status(201).json({ product, review });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ type: error.name, message: error.message });
  }
};

exports.getProductReviews = async function (req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Product not found!" });
    }

    const page = req.query.page || 1;
    const pageSize = 10;

    const accessToken = req
      .header("Authorization")
      .replace("Bearer", "")
      .trim();
    const tokenData = jwt.decode(accessToken);
    const reviews = await Review.find({ _id: { $in: product.reviews } })
      .sort({ date: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const processReviews = [];
    for (const review of reviews) {
      const user = await User.findById(review.user);
      if (!user) {
        processReviews.push(review);
        continue;
      }
      let newReview;
      if (review.userName !== user.name) {
        review.userName = user.name;
        newReview = await review.save({ session });
      }
      processReviews.push(newReview ?? review);
    }
    await session.commitTransaction();
    return res.json(processReviews);
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    return res.status(500).json({ type: error.name, message: error.message });
  } finally {
    await session.endSession();
  }
};
