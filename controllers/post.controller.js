import Post from "../models/post.model.js";
import { errorHandler } from "../utils/errorHandler.js";

export const create = async (req, res, next) => {
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all required fields"));
  }

  const newPost = new Post({
    ...req.body,
    userId: req.user.id,
  });

  console.log(newPost, "newPost");

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};
