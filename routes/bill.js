const express = require("express");
const {
    getBillsOfOneCustomer,
    getAvgBillSpendOfOneCustomer,
} = require("../database");
const router = express.Router();

router.get("/bill/:id", async (req, res) => {
    try {
        const customerID = req.params.id;
        const bills = await getBillsOfOneCustomer(customerID);

        res.status(200).json({ bills });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching Bill");
    }
});

router.get("/bill/:id/averagebill", async (req, res) => {
    try {
        const customerID = req.params.id;
        const bills = await getAvgBillSpendOfOneCustomer(customerID);

        res.status(200).json({ bills });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching Average Bill");
    }
});

module.exports = router;