import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/errorHandler.js";

export const signup = async (req, res, next) => {
  const { username, email, fullName, password } = req.body;

  if (
    !username ||
    !password ||
    !email ||
    !fullName ||
    username === "" ||
    password === "" ||
    email === "" ||
    fullName === ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }

  if (req.body.username) {
    if (req.body.username.length < 4) {
      return next(errorHandler(400, "Username must be at least 4 characters"));
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces"));
    }

    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username can only contain letters and numbers")
      );
    }
  }

  if (req.body.email) {
    if (req.body.email.length < 4) {
      return next(errorHandler(400, "Email must be at least 4 characters"));
    }
    if (req.body.email.includes(" ")) {
      return next(errorHandler(400, "Email cannot contain spaces"));
    }
  }

  if (req.body.fullName) {
    if (req.body.fullName.length < 4) {
      return next(errorHandler(400, "Email must be at least 3 characters"));
    }
  }

  const newUser = new User({
    username,
    fullName,
    email,
    password: bcryptjs.hashSync(password, 10),
  });

  try {
    const isUserExist = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (isUserExist) {
      if (isUserExist.email === email) {
        next(errorHandler(409, "Email already in use"));
      }
      if (isUserExist.username === username) {
        next(
          errorHandler(
            409,
            `${username} - username is already taken. Please choose another username.`
          )
        );
      }
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
        fullName: validUser.fullName,
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
