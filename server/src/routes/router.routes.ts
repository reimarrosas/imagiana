import express from "express";

import authRoutes from "./auth.routes";
import postRoutes from "./posts.routes";
import likeRoutes from "./likes.routes";
import commentRoutes from "./comments.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/likes", likeRoutes);
router.use("/comments", commentRoutes);

export default router;
