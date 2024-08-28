import User from "../models/user.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import bcryptjs from "bcryptjs";

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    const { password, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const updateUserPersonal = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }

  if (
    !req.body.username ||
    !req.body.email ||
    !req.body.fullName ||
    req.body.username === "" ||
    req.body.email === "" ||
    req.body.fullName === ""
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

  try {
    const isUserExist = await User.findOne({
      $and: [
        { _id: { $ne: req.user.id } },
        {
          $or: [{ email: req.body.email }, { username: req.body.username }],
        },
      ],
    });

    if (isUserExist) {
      if (isUserExist.email === req.body.email) {
        next(errorHandler(409, "Email already in use"));
      }
      if (isUserExist.username === req.body.username) {
        next(
          errorHandler(
            409,
            `${req.body.username} - username is already taken. Please choose another username.`
          )
        );
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          fullName: req.body.fullName,
          username: req.body.username,
          email: req.body.email,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const updateUserPassword = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }

  if (
    !req.body.currentPassword ||
    !req.body.newPassword ||
    req.body.currentPassword === "" ||
    req.body.currentPassword === ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }

  if (req.body.currentPassword) {
    if (req.body.currentPassword.length < 4) {
      return next(errorHandler(400, "Username must be at least 4 characters"));
    }
    if (req.body.currentPassword.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces"));
    }

    if (!req.body.currentPassword.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username can only contain letters and numbers")
      );
    }
  }

  if (req.body.newPassword) {
    if (req.body.newPassword.length < 4) {
      return next(errorHandler(400, "Username must be at least 4 characters"));
    }
    if (req.body.newPassword.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces"));
    }

    if (!req.body.newPassword.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username can only contain letters and numbers")
      );
    }
  }

  try {
    const validUser = await User.findById(req.user.id);

    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(
      req.body.currentPassword,
      validUser.password
    );
    if (!validPassword) {
      return next(errorHandler(400, "Invalid current password"));
    }

    const bcPassword = bcryptjs.hashSync(req.body.newPassword, 10);

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          password: bcPassword,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
