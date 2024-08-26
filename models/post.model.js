import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
      maxLength: 200,
    },
    summary: {
      type: String,
      required: true,
      maxLength: 400,
    },
    category: {
      type: String,
      required: true,
      maxLength: 15,
    },
    author: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
