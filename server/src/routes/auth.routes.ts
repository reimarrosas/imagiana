import express from "express";
import { ControllerResponse } from "..";

import {
  authorize,
  login,
  logout,
  signup,
  verify,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify", verify);
router.post("/logout", logout);
router.get("/status", authorize, (req, res) => {
  const response: ControllerResponse = {
    message: "User is logged in!",
    success: true,
    user: req.session.user,
  };
  res.send(response);
});

export default router;
