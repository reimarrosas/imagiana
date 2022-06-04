import express from "express";

import { authorize } from "../controllers/auth.controller";
import { create, del, update } from "../controllers/comments.controller";

const router = express.Router();

router.use(authorize);
router.post("/", create);
router.put("/", update);
router.delete("/", del);

export default router;
