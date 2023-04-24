const express = require("express");
const {
  getAllProduct,
  getOneProductById,
  createProduct,
} = require("../database");
const router = express.Router();

router.post("/product", async (req, res) => {
  try {
    const newProductData = req.body;
    const newProduct = await createProduct(newProductData);
    res.status(201).json({ product: newProduct });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error adding a new product");
  }
});

router.get("/product", async (req, res) => {
  try {
    const products = await getAllProduct();

    res.status(200).json({ products });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching Products");
  }
});

router.get("/product/:id", async (req, res) => {
  try {
    const productID = req.params.id;
    const prod = await getOneProductById(productID);

    res.status(200).json({ prod });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching Product");
  }
});

module.exports = router;
