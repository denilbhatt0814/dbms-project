const mysql = require("mysql2/promise");
const dotenv = require('dotenv').config();
let connection;
exports.connectMySQL = async () => {
  try {
    connection = await mysql.createConnection({
      user: "root",
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: 3306,
      database: "dbmsproject",
    });
    console.log("Connected MySQL!");
  } catch (error) {
    console.log("connectMySQL: ", error);
    process.exit(1);
  }
};

exports.getConnection = async () => {
  try {
    if (!connection) {
      console.log("connecting again");
      await this.connectMySQL();
    }
    return connection;
  } catch (error) {
    console.log("getConnection: ", error);
    return null;
  }
};

// ------------ CUSTOMER ----------------

exports.createCustomer = async (customerData) => {
  const { first_name, last_name, email, phone } = customerData;

  const query = `
    INSERT INTO Customer (first_name, last_name, email, phone)
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await connection.query(query, [
    first_name,
    last_name,
    email,
    phone,
  ]);
  const newCustomerId = result.insertId;
  return { customer_id: newCustomerId, first_name, last_name, email, phone };
};

exports.getAllCustomers = async () => {
  try {
    const query = "SELECT * FROM Customer";
    const [customer] = await connection.query(query);
    return customer;
  } catch (error) {
    throw error;
  }
};

exports.getOneCustomerById = async (id) => {
  try {
    const query = `SELECT * FROM Customer WHERE customer_id= ?`;
    const [rows] = await connection.query(query, [id]);

    if (rows.length > 0) return rows[0];
    else return null;
  } catch (error) {
    throw error;
  }
};

exports.getFavouriveCategoryOfOneCustomer = async (id) => {
  const query = `
      SELECT C.category_name, COUNT(*) AS purchase_count FROM Bill_Product BP
      JOIN Product P ON P.product_id = BP.product_id
      JOIN Category C ON C.category_id = P.category_id
      JOIN Bill B ON B.bill_id = BP.bill_id
      WHERE B.customer_id = ?
      GROUP BY C.category_name
      ORDER BY purchase_count DESC
      LIMIT 1;
    `;
  const [categories] = await connection.query(query, [id]);

  if (categories.length > 0) return categories[0];
  else return null;
};

//--------------- Bills ----------------

exports.getAllBills = async () => {
  const query = `SELECT * FROM Bill`;
  const [bills] = await connection.query(query);

  if (bills.length == 0) return null;

  for (let i = 0; i < bills.length; i++) {
    const bill = bills[i];
    const query =
      "SELECT P.product_id, P.product_name, BP.quantity, P.retail_price FROM Bill_Product BP JOIN Product P ON P.product_id = BP.product_id WHERE BP.bill_id = ?";
    const [products] = await connection.query(query, [bill.bill_id]);
    bills[i].products = products;
  }

  return bills;
};

exports.getBillById = async (id) => {
  let query = `SELECT * FROM Bill WHERE bill_id= ?`;
  const [bills] = await connection.query(query, [id]);

  if (bills.length == 0) return null;

  let bill = bills[0];
  query =
    "SELECT P.product_id, P.product_name, BP.quantity, P.retail_price FROM Bill_Product BP JOIN Product P ON P.product_id = BP.product_id WHERE BP.bill_id = ?";
  const [products] = await connection.query(query, [bill.bill_id]);
  bill.products = products;

  return bill;
};

exports.getBillsOfOneCustomer = async (id) => {
  const query = `SELECT * FROM Bill WHERE customer_id= ?`;
  const [bills] = await connection.query(query, [id]);

  if (bills.length == 0) return null;

  for (let i = 0; i < bills.length; i++) {
    const bill = bills[i];
    const query =
      "SELECT P.product_id, P.product_name, BP.quantity, P.retail_price FROM Bill_Product BP JOIN Product P ON P.product_id = BP.product_id WHERE BP.bill_id = ?";
    const [products] = await connection.query(query, [bill.bill_id]);
    bills[i].products = products;
  }

  return bills;
};

exports.getAvgBillSpendOfOneCustomer = async (id) => {
  const query = `SELECT AVG(total_amount) AS avg_bill FROM Bill WHERE customer_id = ?`;
  const [avg_bill] = await connection.query(query, [id]);
  return avg_bill[0];
};

exports.generateBill = async (customerID, employeeID, productQuantities) => {
  try {
    await connection.beginTransaction();

    const billTotal = await calculateBillTotal(productQuantities);

    const date = new Date();

    const [billResult] = await connection.query(
      "INSERT INTO Bill (employee_id, customer_id, total_amount, date) VALUES (?, ?, ?, ?)",
      [employeeID, customerID, billTotal, date]
    );

    const billID = billResult.insertId;

    await addProductsToBill(billID, productQuantities);

    await connection.commit();

    const bill = await this.getBillById(billID);

    return bill;
  } catch (error) {
    await connection.rollback();
    throw error;
  }
};

async function calculateBillTotal(productQuantities) {
  let total = 0;

  for (const productID in productQuantities) {
    const quantity = productQuantities[productID];

    const [products] = await connection.query(
      "SELECT * FROM Product WHERE product_id = ?",
      [productID]
    );

    const product = products[0];

    if (!product) {
      throw new Error(`Product not found with id ${productID}`);
    }

    if (product.quantity - quantity < 0) {
      throw new Error(`Insufficient stock for product id ${productID}`);
    }

    total += product.retail_price * quantity;
  }

  return total;
}

async function addProductsToBill(billID, productQuantities) {
  for (const productID in productQuantities) {
    const quantity = productQuantities[productID];

    await connection.query(
      "INSERT INTO Bill_Product (bill_id, product_id, quantity) VALUES (?, ?, ?)",
      [billID, productID, quantity]
    );

    await connection.query(
      "UPDATE Product SET quantity = quantity - ? WHERE product_id = ?",
      [quantity, productID]
    );
  }
}

//-------------- Products ----------------

exports.createProduct = async (productData) => {
  const {
    category_id,
    supplier_id,
    product_name,
    quantity,
    retail_price,
    cost_price,
    description,
  } = productData;

  const query = `
    INSERT INTO Product (category_id, supplier_id, product_name, quantity, retail_price, cost_price, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await connection.query(query, [
    category_id,
    supplier_id,
    product_name,
    quantity,
    retail_price,
    cost_price,
    description,
  ]);
  const newProductId = result.insertId;
  return {
    product_id: newProductId,
    category_id,
    supplier_id,
    product_name,
    quantity,
    retail_price,
    cost_price,
    description,
  };
};

exports.getAllProduct = async () => {
  try {
    const query = `SELECT * FROM Product`;
    const [products] = await connection.query(query);
    return products;
  } catch (error) {
    throw error;
  }
};

exports.getOneProductById = async (id) => {
  try {
    const query = `SELECT * FROM Product WHERE product_id= ?`;
    const [rows] = await connection.query(query, [id]);

    if (rows.length > 0) return rows[0];
    else return null;
  } catch (error) {
    throw error;
  }
};

exports.updateProductStock = async (productID, stockToAdd) => {
  try {
    const [products] = await connection.query(
      "SELECT * FROM Product WHERE product_id = ?",
      [productID]
    );
    const product = products[0];

    if (!product) {
      throw new Error(`Product not found with id ${productID}`);
    }

    const updatedStock = parseInt(product.quantity) + stockToAdd;

    await connection.query(
      "UPDATE Product SET quantity = ? WHERE product_id = ?",
      [updatedStock, productID]
    );

    return { ...product, quantity: updatedStock };
  } catch (error) {
    throw error;
  }
};

// --------------- Suppliers --------------

exports.createSupplier = async (supplierData) => {
  const { company_name, contact_name, email, phone } = supplierData;

  const query = `
    INSERT INTO Supplier (company_name, contact_name, email, phone)
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await connection.query(query, [
    company_name,
    contact_name,
    email,
    phone,
  ]);
  const newSupplierId = result.insertId;
  return {
    supplier_id: newSupplierId,
    company_name,
    contact_name,
    email,
    phone,
  };
};

exports.getAllSuppliers = async () => {
  try {
    const query = `SELECT * FROM Supplier`;
    const [suppliers] = await connection.query(query);
    return suppliers;
  } catch (error) {
    throw error;
  }
};

exports.getOneSupplierById = async (id) => {
  try {
    const query = `SELECT * FROM Supplier WHERE supplier_id= ? `;
    const [rows] = await connection.query(query, [id]);

    if (rows.length > 0) return rows[0];
    else return null;
  } catch (error) {
    throw error;
  }
};

// ------------ EMPLOYEE ----------------
exports.getAllEmployees = async () => {
  try {
    const query = "SELECT * FROM Employee";
    const [employees] = await connection.query(query);
    return employees;
  } catch (error) {
    console.error("Error fetching all employees: ", error);
    throw error;
  }
};

exports.getEmployeeById = async (employeeID) => {
  try {
    const query = "SELECT * FROM Employee WHERE employee_id = ?";
    const [employees] = await connection.query(query, [employeeID]);
    if (employees.length > 0) return employees[0];
    else return null;
  } catch (error) {
    console.error("Error fetching employee by ID: ", error);
    throw error;
  }
};

exports.addNewEmployee = async (employeeData) => {
  try {
    const query = `
      INSERT INTO Employee (first_name, last_name, email, phone, position)
      VALUES (?, ?, ?, ?, ?)
      `;
    const [result] = await connection.query(query, [
      employeeData.first_name,
      employeeData.last_name,
      employeeData.email,
      employeeData.phone,
      employeeData.position,
    ]);

    const newEmployee = await this.getEmployeeById(result.insertId);

    return newEmployee;
  } catch (error) {
    throw error;
  }
};
