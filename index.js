const express = require("express");
const cors = require("cors");
const conn = require("./db/conn");
const app = express();
const bcrypt = require("bcryptjs");
const User = require("./models/user.model");
require("dotenv").config();

const salt = bcrypt.genSaltSync(10);

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

conn();

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (err) {
    res.status(400).json(err);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  console.log(userDoc, "userDoc");

  const passOk = bcrypt.compareSync(password, userDoc.password);
  res.json(passOk);
  if (passOk) {
    //logged in
  } else {
    res.status(400).json("Wrong credentials");
  }
});

app.get("/", (req, res) => {
  res.send("Home");
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
