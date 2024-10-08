import express from "express";
import {
  signin,
  logout,
  signup,
  profile,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);
router.get("/profile", profile);

export default router;
