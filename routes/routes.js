app.get("/supplier/:supplierId", async (req, res) => {
  const [rows] = await connection.query(
    "SELECT * FROM supplier WHERE supplier_id= ? ",
    [req.params.supplierId]
  );
  res.send(rows);
});

app.get("/products", async (req, res) => {
  const [rows] = await connection.query("SELECT * FROM product");
  res.send(rows);
});

app.get("/products/:productId", async (req, res) => {
  const [rows] = await connection.query(
    " SELECT * FROM product WHERE product_id= ?",
    [req.params.productId]
  );
  res.send(rows);
});
