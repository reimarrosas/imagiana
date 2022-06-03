import express from "express";

import authRoutes from "./auth.routes";
import postRoutes from "./posts.routes";
import likeRoutes from "./likes.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/likes", likeRoutes);

export default router;
