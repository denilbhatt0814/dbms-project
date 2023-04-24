const express = require("express");
const {
  getAllCustomers,
  getOneCustomerById,
  getFavouriveCategoryOfOneCustomer,
} = require("../database");
const router = express.Router();

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

module.exports = router;
