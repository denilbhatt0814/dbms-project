const express = require("express");
const {
  getAllCustomers,
  getOneCustomerById,
  getFavouriveCategoryOfOneCustomer,
  getBillsOfOneCustomer,
  getAvgBillSpendOfOneCustomer,
  createCustomer,
} = require("../database");
const router = express.Router();

router.post("/customers", async (req, res) => {
  try {
    const newCustomerData = req.body;
    const newCustomer = await createCustomer(newCustomerData);
    res.status(201).json({ customer: newCustomer });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error adding a new customer");
  }
});

router.get("/customers", async (req, res) => {
  try {
    const customers = await getAllCustomers();

    res.status(200).json({ customers });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching customers");
  }
});

router.get("/customers/:id", async (req, res) => {
  try {
    const customerID = req.params.id;
    const customer = await getOneCustomerById(customerID);

    if (!customer) {
      return res.status(404).send(`No customer found with id ${customerID}`);
    }

    return res.status(200).json({ customer });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching customer data");
  }
});

router.get("/customers/:id/favorite-category", async (req, res) => {
  try {
    const customerId = req.params.id;
    const category = await getFavouriveCategoryOfOneCustomer(customerId);

    return res.status(200).json({ category });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error fetching customers favourite category.");
  }
});

router.get("/customers/:id/bills", async (req, res) => {
  try {
    const customerID = req.params.id;
    const bills = await getBillsOfOneCustomer(customerID);

    res.status(200).json({ bills });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching Bill");
  }
});

router.get("/customers/:id/average-bill", async (req, res) => {
  try {
    const customerID = req.params.id;
    const avg_bill = await getAvgBillSpendOfOneCustomer(customerID);

    res.status(200).json(avg_bill);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching Average Bill");
  }
});

module.exports = router;
