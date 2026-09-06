import type { Request, Response } from "express";
import { Analysis } from "../models/analysis.model.js";
import { analyzeRepairReplace } from "../services/repair-replace-analysis.service.js";
import { calculateRepairReplace } from "../services/repair-replace-calculations.service.js";
import { getRepairResources } from "../services/resource.service.js";

export const analyzeRepairReplaceProblem = async (
    req: Request,
    res: Response,
) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId || typeof sessionId !== "string") {
            return res.status(400).json({
                success: false,
                message: "Session ID is required",
            });
        }

        /*
         * --------------------------------------------------
         * 1. GET SESSION
         * --------------------------------------------------
         */

        const analysis = await Analysis.findOne({ sessionId });

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: "Analysis session not found",
            });
        }

        /*
         * --------------------------------------------------
         * 2. VALIDATE STAGE 1
         * --------------------------------------------------
         */

        if (!analysis.inputAnalysis?.understood) {
            return res.status(400).json({
                success: false,
                message: "Problem information is not sufficient",
            });
        }

        const problemSummary = analysis.inputAnalysis.problemSummary;

        if (!problemSummary) {
            return res.status(400).json({
                success: false,
                message: "Problem summary is missing",
            });
        }

        /*
         * --------------------------------------------------
         * 3. PREPARE STAGE 2 CONTEXT
         * --------------------------------------------------
         */

        const userMessages = analysis.inputs
            .map((input, index) => {
                if (input.type === "description" && input.content) {
                    return `Message ${index + 1}: ${input.content}`;
                }

                if (input.type === "image") {
                    if (input.imageAnalysis) {
                        return `
Message ${index + 1}: User provided an image.
Visual observations: ${input.imageAnalysis.observations.join("; ")}
Visible damage: ${input.imageAnalysis.damageDescription || "None identified"}
Affected component: ${input.imageAnalysis.affectedComponent || "Not identified"}
Visible condition: ${input.imageAnalysis.visibleCondition || "Not determined"}
Safety concern: ${input.imageAnalysis.safetyConcern ? "Yes" : "No"}
Safety warning: ${input.imageAnalysis.safetyWarning || "None"}`;
                    }

                    return `Message ${index + 1}: User provided an image, but visual analysis is unavailable.`;
                }

                return null;
            })
            .filter(Boolean)
            .join("\n");

        const inputInformation = [
            `Stage 1 Problem Summary: ${problemSummary}`,
            `Item Name: ${analysis.inputAnalysis.itemName || "Not specified"}`,
            `Item Identified: ${analysis.inputAnalysis.itemIdentified ? "Yes" : "No"}`,
            `Specific Problem: ${analysis.inputAnalysis.problemSpecific ? "Yes" : "No"}`,
            `Image Requested by Stage 1: ${analysis.inputAnalysis.requiresImage ? "Yes" : "No"}`,
            analysis.inputAnalysis.reason ? `Stage 1 Notes: ${analysis.inputAnalysis.reason}` : null,
            `\nChronological User Inputs:\n${userMessages}`,
        ].filter(Boolean).join("\n");

        /*
         * --------------------------------------------------
         * 4. GEMINI STAGE 2
         * --------------------------------------------------
         */

        let repairReplaceAnalysis;

        try {
            repairReplaceAnalysis = await analyzeRepairReplace(
                problemSummary,
                inputInformation,
            );
        } catch (error) {
            console.error(
                "Repair/replace AI analysis failed:",
                error,
            );

            return res.status(503).json({
                success: false,
                message:
                    "Repair/replace AI service is temporarily unavailable. Please try again later.",
            });
        }

        /*
         * --------------------------------------------------
         * 5. BACKEND CALCULATION
         * --------------------------------------------------
         */

        const calculation = calculateRepairReplace(repairReplaceAnalysis);

        /*
         * --------------------------------------------------
         * 6. RESOURCE SEARCH
         * --------------------------------------------------
         */

        const imageComponent = analysis.inputs.find(
            (input) => input.type === "image" && input.imageAnalysis?.affectedComponent
        )?.imageAnalysis?.affectedComponent;

        const resources = await getRepairResources(
            analysis.inputAnalysis.itemName || "item",
            analysis.inputAnalysis.problemSummary || "repair",
            imageComponent
        );

        /*
         * --------------------------------------------------
         * 7. SAVE EVERYTHING
         * --------------------------------------------------
         */

        analysis.repairReplaceAnalysis = repairReplaceAnalysis;
        analysis.repairReplaceCalculation = calculation;
        analysis.resources = resources;
        analysis.status = "completed";
        analysis.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await analysis.save();

        /*
         * --------------------------------------------------
         * 8. RETURN RESPONSE
         * --------------------------------------------------
         */

        return res.status(200).json({
            success: true,
            message: "Repair and replacement analysis completed",
            data: {
                sessionId: analysis.sessionId,
                repairReplaceAnalysis,
                calculation,
                resources,
            },
        });
    } catch (error) {
        console.error(
            "Repair/replace controller error:",
            error,
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};