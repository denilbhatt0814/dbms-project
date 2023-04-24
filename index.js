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

  app.listen(port, () => {
    console.log(`Listening at port at http://localhost:${port}`);
  });
}

main().catch(console.error);
