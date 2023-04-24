const express = require("express");
const {
  getOneSupplierById,
  getAllSuppliers,
  createSupplier,
} = require("../database");
const router = express.Router();

router.post("/suppliers", async (req, res) => {
  try {
    const newSupplierData = req.body;
    const newSupplier = await createSupplier(newSupplierData);
    res.status(201).json({ supplier: newSupplier });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error adding a new supplier");
  }
});

router.get("/suppliers", async (req, res) => {
  try {
    const suppliers = await getAllSuppliers();

    res.status(200).json({ suppliers });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching Suppliers");
  }
});

router.get("/supplier/:id", async (req, res) => {
  try {
    const supplierId = req.params.id;
    const supplier = await getOneSupplierById(supplierId);

    res.status(200).json({ supplier });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching Suppliers");
  }
});

module.exports = router;
