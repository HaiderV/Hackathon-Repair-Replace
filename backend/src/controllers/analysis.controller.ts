import type { Request, Response } from "express";
import crypto from "node:crypto";
import { Analysis } from "../models/analysis.model.js";
import { uploadImage } from "../services/cloudinary.service.js";

export const analyzeProblem = async (req: Request, res: Response) => {
    try {
        const { description, sessionId } = req.body;
        const image = req.file;

        const hasDescription =
            typeof description === "string" &&
            description.trim().length > 0;

        const hasImage = !!image;

        // At least one input is required
        if (!hasDescription && !hasImage) {
            return res.status(400).json({
                success: false,
                message: "Provide a description or an image"
            });
        }

        let analysis;

        // Existing session
        if (sessionId) {
            analysis = await Analysis.findOne({ sessionId });

            if (!analysis) {
                return res.status(404).json({
                    success: false,
                    message: "Session not found"
                });
            }
        }

        // New session
        else {
            const newSessionId = crypto.randomUUID();

            analysis = new Analysis({
                sessionId: newSessionId,
                inputs: [],
                status: "collecting_information"
            });
        }

        // Save description
        if (hasDescription) {
            analysis.inputs.push({
                type: "description",
                content: description.trim()
            });
        }

        // Upload image
        if (hasImage) {
            const uploadedImage = await uploadImage(image.buffer);

            analysis.inputs.push({
                type: "image",
                imageUrl: uploadedImage.secure_url,
                publicId: uploadedImage.public_id
            });
        }

        await analysis.save();

        return res.status(200).json({
            success: true,
            message: "Input saved successfully",
            data: {
                sessionId: analysis.sessionId,
                inputs: analysis.inputs
            }
        });

    } catch (error) {
        console.error("Analysis error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};