import express from "express";
import {
  getUserById,
  updateUserPersonal,
  updateUserPassword,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/:userId", getUserById);
router.put("/update-user/:userId", verifyToken, updateUserPersonal);
router.put("/update-password/:userId", verifyToken, updateUserPassword);

export default router;
