const express = require("express");
const mysql = require("mysql2/promise");
const app = express();
// const router = require("./routes/Route");
const port = 3000;

let connection;
mysql
  .createConnection({
    user: "root",
    password: "",
    host: "localhost",
    port: 3307,
  })
  .then((c) => {
    connection = c;
  })
  .catch((err) => console.error(err));

const router = express.Router();

router.get("/user/:userId", async (req, res) => {
  const [rows] = await connection.query(
    "SELECT * FROM customer WHERE customer_id= ?",
    [req.params.userId]
  );
  res.send(rows);
});

router.get("/user/:userId/bills", async (req, res) => {
  const [rows] = await connection.query(
    "SELECT * FROM bill WHERE customer_id= ?",
    [req.params.userId]
  );
  res.send(rows);
});

router.get("/user/:userId/favourite-category", async (req, res) => {
  const [rows] = await connection.query(
    "SELECT C.category_name, COUNT(*) AS purchase_count FROM Bill_Product BP JOIN Product P ON P.product_id = BP.product_id JOIN Category C ON C.category_id = P.category_id JOIN Bill B ON B.bill_id = BP.bill_id WHERE B.customer_id = ? GROUP BY C.category_name ORDER BY purchase_count DESC  LIMIT 1 ",
    [req.params.userId]
  );
});

router.get("/user/:userId/avgbills", async (req, res) => {
  const [rows] = await connection.query(
    " SELECT AVG(total_amount) AS avg_bill FROM Bill WHERE customer_id = ?",
    [req.params.userId]
  );
  res.send(rows);
});

router.get("/supplier/:supplierId", async (req, res) => {
  const [rows] = await connection.query(
    "SELECT * FROM supplier WHERE supplier_id= ? ",
    [req.params.supplierId]
  );
  res.send(rows);
});

router.get("/products", async (req, res) => {
  const [rows] = await connection.query("SELECT * FROM product");
  res.send(rows);
});

router.get("/products/:productId", async (req, res) => {
  const [rows] = await connection.query(
    " SELECT * FROM product WHERE product_id= ?",
    [req.params.productId]
  );
  res.send(rows);
});

app.use("/", router);

// connection.connect(function (err) {
//   if (err) throw err;
//   console.log(" MySQL is Connected!");

// });

app.listen(port, () => {
  console.log(`Listening at port at http://localhost:${port}`);
});
