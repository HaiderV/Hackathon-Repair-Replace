import type { Request, Response } from "express";
import crypto from "node:crypto";
import { Analysis } from "../models/analysis.model.js";
import { deleteImage, uploadImage } from "../services/cloudinary.service.js";
import { analyzeInput } from "../services/input-analysis.service.js";
import { calculateConfidence } from "../services/confidence.service.js";
import { analyzeImage } from "../services/image-analysis.service.js";

const typeNormalizeSessionId = (
  value: string | string[] | undefined,
): string | null => {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
};

export const analyzeProblem = async (req: Request, res: Response) => {
  try {
    const { description, sessionId } = req.body;
    const image = req.file;
    const existingSessionId = typeNormalizeSessionId(
      typeof sessionId === "string" || Array.isArray(sessionId)
        ? sessionId
        : undefined,
    );

    const hasDescription =
      typeof description === "string" && description.trim().length > 0;

    const hasImage = !!image;

    // At least one input is required
    if (!hasDescription && !hasImage) {
      return res.status(400).json({
        success: false,
        message: "Provide a description or an image",
      });
    }

    let analysis;

    // Existing session
    if (existingSessionId) {
      analysis = await Analysis.findOne({ sessionId: existingSessionId });

      if (!analysis) {
        return res.status(404).json({
          success: false,
          message: "Session not found",
        });
      }
    }

    // New session
    else {
      const newSessionId = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

      analysis = new Analysis({
        sessionId: newSessionId,
        inputs: [],
        status: "collecting_information",
        expiresAt,
      });
    }

    // Save description
    if (hasDescription) {
      analysis.inputs.push({
        type: "description",
        content: description.trim(),
      });
    }

    // Upload image
    if (hasImage) {
      const uploadedImage = await uploadImage(image.buffer);

      // Fallback / normalize MIME type if client sent application/octet-stream
      let mimeType = image.mimetype;
      if (!mimeType || mimeType === "application/octet-stream") {
        const ext = image.originalname?.split(".").pop()?.toLowerCase();
        if (ext === "png") mimeType = "image/png";
        else if (ext === "webp") mimeType = "image/webp";
        else if (ext === "gif") mimeType = "image/gif";
        else mimeType = "image/jpeg"; // default fallback
      }

      let imageAnalysis;

      try {
        imageAnalysis = await analyzeImage(
          image.buffer,
          mimeType,
        );
      } catch (error) {
        console.error("Image analysis failed:", error);

        // Remove the Cloudinary image if AI analysis fails
        try {
          await deleteImage(uploadedImage.public_id);
        } catch (deleteError) {
          console.error(
            "Failed to delete uploaded image after analysis failure:",
            deleteError,
          );
        }

        const is429 = (error as any)?.status === 429 || /quota|resource_exhausted|429/i.test(String(error));
        const message = is429
          ? "AI API rate limit or quota reached (HTTP 429). Please verify your GEMINI_API_KEY in backend/.env."
          : ((error as any)?.message || "Image analysis service is temporarily unavailable. Please try again later.");

        return res.status(is429 ? 429 : 503).json({
          success: false,
          message,
        });
      }

      analysis.inputs.push({
        type: "image",
        imageUrl: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
        imageAnalysis,
      });
    }

    analysis.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Gemini AI analysis

    const inputText = analysis.inputs
      .map((input, index) => {
        if (input.type === "description" && input.content) {
          return `Message ${index + 1}: ${input.content}`;
        }

        if (input.type === "image" && input.imageUrl) {
          return `Message ${index + 1}: User provided an image at ${input.imageUrl}`;
        }

        return null;
      })
      .filter(Boolean)
      .join("\n");

    let confidenceResult: ReturnType<typeof calculateConfidence> | null = null;

    try {
      const result = await analyzeInput(inputText);
      const calculatedConfidence = calculateConfidence(result);

      confidenceResult = calculatedConfidence;

      if (confidenceResult.understood) {
        result.missingInformation = [];
        result.questions = [];
      }

      analysis.inputAnalysis = {
        ...result,
        confidence: confidenceResult.confidence,
        understood: confidenceResult.understood,
      };

      if (confidenceResult.understood) {
        analysis.status = "ready_for_analysis";
      } else {
        analysis.status = "collecting_information";
      }
    } catch (error: any) {
      console.error("Gemini analysis failed:", error);

      const is429 = error?.status === 429 || /quota|resource_exhausted|429/i.test(String(error));
      const message = is429
        ? "AI API rate limit or quota reached (HTTP 429). Please verify your GEMINI_API_KEY in backend/.env."
        : (error?.message || "AI analysis service is temporarily unavailable. Please try again later.");

      return res.status(is429 ? 429 : 503).json({
        success: false,
        message,
      });
    }

    // save the analysis document

    await analysis.save();

    return res.status(200).json({
      success: true,
      message: confidenceResult?.understood
        ? "Problem understood"
        : "More information is required",
      data: {
        sessionId: analysis.sessionId,
        inputAnalysis: analysis.inputAnalysis,
        status: analysis.status,
      },
    });
  } catch (error) {
    console.error("Analysis error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAnalysis = async (req: Request, res: Response) => {
  try {
    const sessionId = typeNormalizeSessionId(req.params.sessionId);

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required",
      });
    }

    const analysis = await Analysis.findOne({ sessionId: sessionId as string });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error("Get analysis error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteAnalysis = async (req: Request, res: Response) => {
  try {
    const sessionId = typeNormalizeSessionId(req.params.sessionId);

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required",
      });
    }

    const analysis = await Analysis.findOne({ sessionId });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    //Delete

    for (const input of analysis.inputs) {
      if (input.type === "image" && input.publicId) {
        try {
          await deleteImage(input.publicId);
          console.log(`Deleted image with publicId: ${input.publicId}`);
        } catch (error) {
          console.error("Error deleting image:", error);
        }
      }
    }

    await Analysis.deleteOne({ sessionId });
    return res.status(200).json({
      success: true,
      message: "Analysis and associated images deleted successfully",
    });
  } catch (error) {
    console.error("Delete analysis error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
