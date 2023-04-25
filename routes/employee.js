const express = require("express");
const {
  getEmployeeById,
  getAllEmployees,
  addNewEmployee,
} = require("../database");

const router = express.Router();

router.get("/employees", async (req, res) => {
  try {
    const employees = await getAllEmployees();

    res.status(200).json({ employees });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching employees");
  }
});

router.post("/employees", async (req, res) => {
  try {
    const newEmployeeData = req.body;
    const newEmployee = await addNewEmployee(newEmployeeData);

    res.status(201).json({ employee: newEmployee });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error adding employee");
  }
});

router.get("/employees/:id", async (req, res) => {
  try {
    const employeeID = req.params.id;
    const employee = await getEmployeeById(employeeID);

    if (!employee) {
      return res.status(404).send(`No employee found with id ${employeeID}`);
    }

    return res.status(200).json({ employee });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching employee data");
  }
});

module.exports = router;
