const express = require("express");
const {
    getAllProduct,
    getOneProductById,
} = require("../database");
const router = express.Router();

router.get("/product", async (req, res) => {
    try {
        const product = await getAllProduct();

        res.status(200).json({ product });
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