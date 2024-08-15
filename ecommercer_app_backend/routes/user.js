const express = require("express");

const router = express.Router();

const userController = require("../controller/user");
const wishlistController = require("../controller/wishlist");
const cartController = require("../controller/cart");
//user
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);

//wishlist
router.get("/:id/wishlist", wishlistController.getUserWishlist);
router.post("/:id/wishlist", wishlistController.addToWishlist);
router.delete(
  "/:id/wishlist/:productId",
  wishlistController.removeFromWishlist
);

//cart
router.get("/:id/cart", cartController.getUserCart);
router.get("/:id/cart/count", cartController.getUserCartCount);
router.get("/:id/cart/:cartProductId", cartController.getCartProductById);
router.post("/:id/cart", cartController.addToCart);
router.put("/:id/cart/:cartProductId", cartController.modifyProductQuantity);
router.delete("/:id/cart/:cartProductId", cartController.removeFromCart);

module.exports = router;
