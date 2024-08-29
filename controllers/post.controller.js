import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/errorHandler.js";

export const create = async (req, res, next) => {
  const { title, content, category, summary } = req.body;
  if (!title || !content || !category || !summary) {
    return next(errorHandler(400, "Please provide all required fields"));
  }

  try {
    const isUserExist = await User.findOne({
      _id: req.user.id,
    });

    if (!isUserExist) {
      return next(errorHandler(400, "Can`t find a user!"));
    }

    const newPost = new Post({
      ...req.body,
      userId: req.user.id,
      author: isUserExist.fullName,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const posts = await Post.find({})
      .sort({ updatedAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    res.status(200).json({
      posts,
      totalPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const getPostsByUserId = async (req, res, next) => {
  try {
    const posts = await Post.find({ userId: req.params.userId }).sort({
      updatedAt: -1,
    });

    const totalPosts = await Post.countDocuments();

    res.status(200).json({
      posts,
      totalPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePostById = async (req, res, next) => {
  if (req?.user?.id !== req.params?.userId) {
    return next(errorHandler(403, "You are not allowed to update this post"));
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          summary: req.body.summary,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

export const deletePostById = async (req, res, next) => {
  if (req?.user?.id !== req.params?.userId) {
    return next(errorHandler(403, "You are not allowed to delete this post"));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json({ message: "The post has been deleted" });
  } catch (error) {
    next(error);
  }
};
