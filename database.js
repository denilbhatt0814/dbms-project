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

exports.getBillsOfOneCustomer = async (id) => {
  const query = `SELECT * FROM Bill WHERE customer_id= ?`;
  const [bills] = await connection.query(query, [id]);

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

exports.getAllProduct = async () => {
  try {
    const query = `SELECT * FROM Product`;
    const [product] = await connection.query(query);
    return product;
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

exports.getAllSupplier = async () => {
  try {
    const query = `SELECT * FROM supplier` ;
    const [product] = await connection.query(query);
    return product;
  } catch (error) {
    throw error;
  }
};

exports.getOneSupplierById = async (id) => {
  try {
    const query = `SELECT * FROM supplier WHERE supplier_id= ? `;
    const [rows] = await connection.query(query, [id]);

    if (rows.length > 0) return rows[0];
    else return null;
  } catch (error) {
    throw error;
  }
};