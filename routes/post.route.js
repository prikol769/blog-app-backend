import express from "express";
import {
  create,
  getPostById,
  getPosts,
  deletePostById,
} from "../controllers/post.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/", verifyToken, create);
router.get("/:postId", getPostById);
router.get("/", getPosts);
router.delete("/:postId/:userId", verifyToken, deletePostById);

export default router;
