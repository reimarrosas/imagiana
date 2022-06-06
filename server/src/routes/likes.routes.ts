import express from "express";

import { authorize } from "../controllers/auth.controller";
import { like, unlike } from "../controllers/likes.controller";

const router = express.Router();

router.use(authorize);
router.post("/like", like);
router.delete("/unlike", unlike);

export default router;
