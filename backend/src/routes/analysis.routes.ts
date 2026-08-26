import Router from "express";
import { analyzeProblem } from "../controllers/analysis.controller.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

router.post("/", upload.single("image"), analyzeProblem);

export default router;