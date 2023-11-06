const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const mysql = require("mysql");

const app = require("./app");

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Aplicação iniciada na porta ${port}`);
});
