import express from "express";
import {
  create,
  getPostById,
  getPosts,
  deletePostById,
  updatePostById,
  getPostsByUserId,
} from "../controllers/post.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/", verifyToken, create);
router.get("/:postId", getPostById);
router.put("/:postId/:userId", verifyToken, updatePostById);
router.get("/", getPosts);
router.get("/user-posts/:userId", getPostsByUserId);
router.delete("/:postId/:userId", verifyToken, deletePostById);

export default router;
