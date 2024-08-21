const express = require("express");
const cors = require("cors");
const conn = require("./db/conn");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/user.model");
require("dotenv").config();

const salt = bcrypt.genSaltSync(10);
const secret = "asdsadsa5dsa5d5as45d4as4d5";

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
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
  if (passOk) {
    // logged in
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("wrong credentials");
  }
});

app.get("/", (req, res) => {
  res.send("Home");
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
