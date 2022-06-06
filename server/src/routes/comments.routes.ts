import express from "express";

import { authorize } from "../controllers/auth.controller";
import { create, del, update } from "../controllers/comments.controller";

const router = express.Router();

router.use(authorize);
router.post("/create", create);
router.put("/update", update);
router.delete("/delete", del);

export default router;
