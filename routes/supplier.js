const express = require("express");
const {
    getAllSupplier,
    getOneSupplierById
} = require("../database");
const router = express.Router();


router.get("/supplier", async (req, res) => {
    try {
        const supplier = await getAllSupplier();

        res.status(200).json({ supplier });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching Suppliers");
    }
});

router.get("/supplier/:id", async (req, res) => {
    try {
        const supplierId = req.params.id;
        const prod = await getOneSupplierById(supplierId);

        res.status(200).json({ prod });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching Suppliers");
    }
});

module.exports = router;