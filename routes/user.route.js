import express from "express";
import { getUserById } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/:userId", getUserById);

export default router;
