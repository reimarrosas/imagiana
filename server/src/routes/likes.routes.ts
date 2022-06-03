import express from "express";

import { authorize } from "../controllers/auth.controller";
import { like, unlike } from "../controllers/likes.controller";

const router = express.Router();

router.use(authorize);
router.put("/", like);
router.delete("/", unlike);

export default router;
