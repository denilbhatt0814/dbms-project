const experss = require("express");
const router = experss.Router();

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

module.exports = router;
