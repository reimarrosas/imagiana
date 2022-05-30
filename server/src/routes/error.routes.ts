import express from "express";

import { notFound, error } from "../controllers/error.controller";

const router = express.Router();

router.use(notFound);
router.use(error);

export default router;
