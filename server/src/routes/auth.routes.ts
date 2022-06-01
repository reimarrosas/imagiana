import express from "express";

import {
  login,
  logout,
  signup,
  verify,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify", verify);
router.get("/logout", logout);

export default router;
