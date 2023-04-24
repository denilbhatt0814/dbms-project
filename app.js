const mysql = require("mysql2/promise");

let c;
mysql
  .createConnection({
    user: "root",
    password: "root",
  })
  .then((conn) => {
    c = conn;
  })
  .catch((error) => {
    console.log(error);
  });
