import express from "express";

import errorRoutes from "./error.routes";

const router = express.Router();

router.use(errorRoutes);

export default router;
