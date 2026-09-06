import Router from "express";

import {
    analyzeRepairReplaceProblem,
} from "../controllers/repair-replace.controller.js";

const router = Router();

router.post(
    "/",
    analyzeRepairReplaceProblem,
);

export default router;