import express from "express";
import { authorize } from "../controllers/auth.controller";

import { create, delPost, getAll } from "../controllers/posts.controller";

const router = express.Router();

router.use(authorize);
router.get("/", getAll);
router.post("/create", create);
router.get("/delete", delPost);

export default router;
