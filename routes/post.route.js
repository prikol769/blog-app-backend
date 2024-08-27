import express from "express";
import {
  create,
  getPostById,
  getPosts,
  deletePostById,
  updatePostById,
} from "../controllers/post.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/", verifyToken, create);
router.get("/:postId", getPostById);
router.put("/:postId/:userId", verifyToken, updatePostById);
router.get("/", getPosts);
router.delete("/:postId/:userId", verifyToken, deletePostById);

export default router;
