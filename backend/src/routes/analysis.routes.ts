import Router from "express";
import { analyzeProblem, getAnalysis, deleteAnalysis } from "../controllers/analysis.controller.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

router.post("/", upload.single("image"), analyzeProblem);
router.delete("/:sessionId", deleteAnalysis);
router.get("/:sessionId", getAnalysis);

export default router;