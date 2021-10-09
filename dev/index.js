const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const app = express();

const port = 3000;
const publicDirectoryPath = path.join(__dirname, "../public");
// console.log(__dirname);
app.use(express.static(publicDirectoryPath));

app.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
