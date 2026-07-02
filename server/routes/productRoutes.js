const express = require("express");
const router = express.Router();

const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    generateDescription
} = require("../controllers/productController");

// AI Description Route
router.post("/generate-description", generateDescription);

// CRUD Routes
router.route("/")
    .get(getProducts)
    .post(createProduct);

router.route("/:id")
    .get(getProductById)
    .put(updateProduct)
    .delete(deleteProduct);

module.exports = router;