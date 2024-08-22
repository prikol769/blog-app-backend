import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/errorHandler.js";

export const signup = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password || username === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  }
  const newUser = new User({
    username,
    password: bcryptjs.hashSync(password, 10),
  });

  try {
    const isUserExist = await User.findOne({ username });
    if (isUserExist) {
      next(errorHandler(409, "Username already exists"));
    }
    await newUser.save();
    res.json("Signup successful");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password || username === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ username });

    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid email or password"));
    }

    const { password: pass, ...rest } = validUser._doc;

    const token = jwt.sign(
      {
        id: validUser._id,
        username: validUser.username,
      },
      process.env.JWT_SECRET
    );

    res.status(200).cookie("_blog_token", token).json(rest);
  } catch (error) {
    next(error);
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
