const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");
const { generateProductDescriptionWithAI } = require("../services/aiService");

const collectionName = "products";

// Helper to get collection
const getCollection = () => getDB().collection(collectionName);

// =======================================
// Get All Products
// GET /api/products
// =======================================
const getProducts = async(req, res) => {
    try {
        const { search } = req.query;
        const query = {};

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        const products = await getCollection().find(query).toArray();

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message,
        });
    }
};

// =======================================
// Get Product By ID
// GET /api/products/:id
// =======================================
const getProductById = async(req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid Product ID",
            });
        }

        const product = await getCollection().findOne({
            _id: new ObjectId(id),
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message,
        });
    }
};

// =======================================
// Create Product
// POST /api/products
// =======================================
const createProduct = async(req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            stock,
            image,
        } = req.body;

        if (!name || !description || !price || !category) {
            return res.status(400).json({
                message: "Please fill all required fields",
            });
        }

        const newProduct = {
            name,
            description,
            price: Number(price),
            category,
            stock: Number(stock) || 0,
            image: image || "",
            createdAt: new Date(),
        };

        const result = await getCollection().insertOne(newProduct);

        const createdProduct = await getCollection().findOne({
            _id: result.insertedId,
        });

        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message,
        });
    }
};

// =======================================
// Update Product
// PUT /api/products/:id
// =======================================
const updateProduct = async(req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid Product ID",
            });
        }

        const updates = {...req.body };

        if (updates.price !== undefined) {
            updates.price = Number(updates.price);
        }

        if (updates.stock !== undefined) {
            updates.stock = Number(updates.stock);
        }

        delete updates._id;

        const existingProduct = await getCollection().findOne({
            _id: new ObjectId(id),
        });

        if (!existingProduct) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        await getCollection().updateOne({ _id: new ObjectId(id) }, { $set: updates });

        const updatedProduct = await getCollection().findOne({
            _id: new ObjectId(id),
        });

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message,
        });
    }
};

// =======================================
// Delete Product
// DELETE /api/products/:id
// =======================================
const deleteProduct = async(req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid Product ID",
            });
        }

        const result = await getCollection().deleteOne({
            _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.status(200).json({
            message: "Product removed successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message,
        });
    }
};

// =======================================
// Generate AI Product Description
// POST /api/products/generate-description
// =======================================
const generateDescription = async(req, res) => {
    try {
        const { name, category } = req.body;

        if (!name || !category) {
            return res.status(400).json({
                message: "Product name and category are required",
            });
        }

        const description = await generateProductDescriptionWithAI(
            name,
            category
        );

        res.status(200).json({
            description,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message,
        });
    }
};

// =======================================
// Export Controllers
// =======================================
module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    generateDescription,
};