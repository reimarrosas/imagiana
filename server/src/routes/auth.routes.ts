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
router.get("/logout", logout);
router.get("/authStatus", authorize, (_req, res) => {
  const response: ControllerResponse = {
    message: "User is logged in!",
    success: true,
  };
  res.send(response);
});

export default router;
