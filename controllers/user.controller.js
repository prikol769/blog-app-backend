import User from "../models/user.model.js";

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    const { password, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
