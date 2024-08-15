const express = require("express");
const router = express.Router();

//user
const userController = require("../controller/admin/users");
const categoryController = require("../controller/admin/category");
const orderController = require("../controller/admin/order");
const productController = require("../controller/admin/product");

//user
router.get("/users/count", userController.getUsersCount);
router.delete("/users/:id", userController.deleteUser);

//categories
router.post("/categories", categoryController.addCategory);
router.put("/categories/:id", categoryController.editCategory);
router.delete("/categories/:id", categoryController.deleteCategory);

//product
router.get("/products/count", productController.getProductsCount);
router.get("/products", productController.getProducts);
router.post("/products", productController.addProduct);
router.put("/products/:id", productController.editProduct);
router.delete("/products/:id/images", productController.deleteProductImages);
router.delete("/products/:id", productController.deleteProduct);

//order
router.get("/orders", orderController.getOrders);
router.get("/orders/count", orderController.getOrdersCount);
router.put("/orders/:id", orderController.changeOrderStatus);
router.delete("/orders/:id", orderController.deleteOrder);

module.exports = router;
