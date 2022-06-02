import express from "express";
import { authorize } from "../controllers/auth.controller";

import { create, getAll } from "../controllers/posts.controller";

const router = express.Router();

router.use(authorize);
router.get("/", getAll);
router.post("/create", create);

export default router;
