const express = require("express");
const router = express.Router();

const orderController = require("../controller/order");

router.get("/user/:userId", orderController.getUserOrder);
router.get("/:id", orderController.getOrderById);

module.exports = router;
