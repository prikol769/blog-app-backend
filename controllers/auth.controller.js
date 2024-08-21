import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcryptjs.hashSync(password, 10),
    });
    res.json(userDoc);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const signin = async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });

  const passOk = bcryptjs.compareSync(password, userDoc.password);
  if (passOk) {
    // logged in
    jwt.sign(
      { username, id: userDoc._id },
      process.env.JWT_SECRET,
      {},
      (err, token) => {
        if (err) throw err;

        res.cookie("_blog_token", token).json({
          id: userDoc._id,
          username,
        });
      }
    );
  } else {
    res.status(400).json("wrong credentials");
  }
};

export const logout = (req, res, next) => {
  try {
    res.clearCookie("_blog_token").status(200).json("User has been signed out");
  } catch (error) {
    next(error);
  }
};

export const profile = (req, res) => {
  const { _blog_token } = req.cookies;
  jwt.verify(_blog_token, process.env.JWT_SECRET, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
};
