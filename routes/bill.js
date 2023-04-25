const express = require("express");
const {
  getAllBills,
  getBillById,
  generateBill,
  getEmployeeById,
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

router.post("/bill/generate", async (req, res) => {
  try {
    const { customerID, employeeID, productQuantities } = req.body;

    // Check if employee allowed to generate bill
    const employee = await getEmployeeById(employeeID);
    if (
      !employee ||
      (employee.position != "Cashier" && employee.position != "Manager")
    ) {
      return res
        .status(403)
        .send(
          `Employee id ${employeeID} is not allowed to generate Bills. (Allowed: Cashier | Manager)`
        );
    }

    const bill = await generateBill(customerID, employeeID, productQuantities);

    res.status(201).json({ bill });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error generating bill");
  }
});

module.exports = router;
