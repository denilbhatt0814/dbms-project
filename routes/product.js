const express = require("express");
const {
  getAllProduct,
  getOneProductById,
  createProduct,
  updateProductStock,
  getEmployeeById,
} = require("../database");
const router = express.Router();

router.post("/product", async (req, res) => {
  try {
    const newProductData = req.body;
    const employeeID = req.body.employee_id;
    // Check if employee allowed to stock a product
    const employee = await getEmployeeById(employeeID);
    if (
      !employee ||
      (employee.position != "Stock Clerk" && employee.position != "Manager")
    ) {
      return res
        .status(403)
        .send(
          `Employee id ${employeeID} is not allowed to add new Product. (Allowed: Stock Clerk | Manager)`
        );
    }

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

router.put("/product/:id/stock", async (req, res) => {
  try {
    const productID = req.params.id;
    const { employeeID, stockToAdd } = req.body;

    // Check if employee allowed to stock a product
    const employee = await getEmployeeById(employeeID);
    if (
      !employee ||
      (employee.position != "Stock Clerk" && employee.position != "Manager")
    ) {
      return res
        .status(403)
        .send(
          `Employee id ${employeeID} is not allowed to add stock. (Allowed: Stock Clerk | Manager)`
        );
    }

    const updatedProduct = await updateProductStock(productID, stockToAdd);

    res.status(200).json({ updatedProduct });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error updating product stock");
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
