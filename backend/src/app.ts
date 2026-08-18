import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
    res.json({
        success: true,
        message: "Repair Before Replace API is running"
    });
});

export default app;