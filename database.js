const mysql = require("mysql2/promise");

let connection;

exports.connectMySQL = async () => {
  try {
    connection = await mysql.createConnection({
      user: "root",
      password: "your_password",
      host: "172.17.0.2",
      port: 3306,
      database: "dbms_project",
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
      "SELECT P.product_id, P.product_name FROM Bill_Product BP JOIN Product P ON P.product_id = BP.product_id WHERE BP.bill_id = ?";
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
    "SELECT P.product_id, P.product_name FROM Bill_Product BP JOIN Product P ON P.product_id = BP.product_id WHERE BP.bill_id = ?";
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
      "SELECT P.product_id, P.product_name FROM Bill_Product BP JOIN Product P ON P.product_id = BP.product_id WHERE BP.bill_id = ?";
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
