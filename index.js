const express = require("express");
const db = require("./database");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
const cors = require("cors");

const app = express();
// app.use(cors);
const port = 3000;

async function main() {
  await db.connectMySQL();

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use(express.json());

  const customerRouter = require("./routes/customer");
  app.use("/", customerRouter);

  // BILL ROUTER
  const billRouter = require("./routes/bill");
  app.use("/", billRouter);

  // PRODUCT ROUTER
  const prodRouter = require("./routes/product");
  app.use("/", prodRouter);

  // SUPPLIER ROUTER
  const supplierRouter = require("./routes/supplier");
  app.use("/", supplierRouter);

  app.listen(port, () => {
    console.log(`Listening at port at http://localhost:${port}`);
  });
}

main().catch(console.error);
