const express = require("express");
const conn = require("./db/conn");
const app = express();
const setupUsers = require("./db/setupUsers");
const User = require("./models/user.model");
require("dotenv").config();

app.use(express.json());

const PORT = process.env.PORT;

conn();

app.get("/", (req, res) => {
  res.send("Home");
});

app.get("/users", async (req, res) => {
  try {
    const createdUsers = await User.create(setupUsers);
    res.json(createdUsers);
  } catch (error) {
    console.log(
      `Something went wrong with connect to the database ${error.message}`
    );
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
