const express = require("express");

const router = express.Router();

const categoriesController = require("../controller/categories");

router.get("/", categoriesController.getCategories);
router.get("/:id", categoriesController.getCategoriesById);
// router.get("/", categoriesController.getCategories);

module.exports = router;
