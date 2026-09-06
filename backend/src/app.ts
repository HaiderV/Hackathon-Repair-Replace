import express from "express";
import cors from "cors";
import analysisRoutes from "./routes/analysis.routes.js";
import repairReplaceRoutes from "./routes/repair-replace.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/analysis", analysisRoutes);
app.use("/api/repair-replace", repairReplaceRoutes);

app.get("/", (_req, res) => {
    res.json({
        success: true,
        message: "Repair Before Replace API is running"
    });
});

export default app;