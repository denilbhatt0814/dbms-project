const express = require("express");
const {
  getBillsOfOneCustomer,
  getAvgBillSpendOfOneCustomer,
  getAllBills,
  getBillById,
} = require("../database");
const router = express.Router();

router.get("/bill", async (req, res) => {
  try {
    const bills = await getAllBills();

    res.status(200).json({ bills });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching Bills");
  }
});

router.get("/bill/:id", async (req, res) => {
  try {
    const billID = req.params.id;
    const bill = await getBillById(billID);
    if (!bill) return res.status(404).send(`No bill found with id ${billID}`);
    return res.status(200).json({ bill });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching Bill");
  }
});

module.exports = router;
