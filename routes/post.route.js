import express from "express";
import { create, getPostById, getPosts } from "../controllers/post.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/", verifyToken, create);
router.get("/:postId", getPostById);
router.get("/", getPosts);

export default router;
