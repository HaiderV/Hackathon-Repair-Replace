import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const localEnvPath = path.resolve(process.cwd(), ".env");
const backendEnvPath = path.resolve(process.cwd(), "backend/.env");
const rootEnvPath = path.resolve(process.cwd(), "../.env");

if (fs.existsSync(localEnvPath)) {
    dotenv.config({ path: localEnvPath });
}

if (fs.existsSync(backendEnvPath)) {
    dotenv.config({ path: backendEnvPath });
}

if (fs.existsSync(rootEnvPath)) {
    dotenv.config({ path: rootEnvPath });
}

const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("Missing GEMINI_API_KEY environment variable.");
    }

    return new GoogleGenAI({ apiKey });
};

export interface ImageAnalysisResult {
    imageRelevant: boolean;
    itemVisible: boolean;
    visibleDamage: boolean;
    damageDescription: string | null;
    affectedComponent: string | null;
    visibleCondition: string | null;
    safetyConcern: boolean;
    safetyWarning: string | null;
    observations: string[];
    limitations: string[];
}

export const analyzeImage = async (
    imageBuffer: Buffer,
    mimeType: string,
): Promise<ImageAnalysisResult> => {

    const prompt = `
You are the visual inspection stage of a physical item repair assistance system.

Your ONLY job is to inspect the provided image and describe what can
reasonably be observed visually.

DO NOT:
- provide repair instructions
- recommend repair or replacement
- estimate cost
- estimate repair time
- assign repair difficulty
- decide whether repair is feasible
- invent information that cannot be seen

Analyze ONLY visible information.

Determine:

1. imageRelevant
   - Is the image useful for understanding the physical item/problem?

2. itemVisible
   - Is a physical item clearly visible?

3. visibleDamage
   - Is visible physical damage present?

4. damageDescription
   - Briefly describe visible damage if present.

5. affectedComponent
   - Identify the visibly affected component if possible.

6. visibleCondition
   - Describe the visible physical condition.

7. safetyConcern
   - True only if the image shows a potentially dangerous condition,
     such as exposed electrical wiring, burning, severe structural damage,
     leaking hazardous material, etc.

8. safetyWarning
   - Short warning if a visible safety concern exists.

9. observations
   - Important factual visual observations.

10. limitations
   - Things that cannot be determined from the image.

IMPORTANT:
- Never assume an internal fault from appearance alone.
- If something cannot be determined visually, say so.
- Do not identify a repair method.
- Do not decide repair vs replacement.

Return ONLY valid JSON:

{
  "imageRelevant": boolean,
  "itemVisible": boolean,
  "visibleDamage": boolean,
  "damageDescription": string | null,
  "affectedComponent": string | null,
  "visibleCondition": string | null,
  "safetyConcern": boolean,
  "safetyWarning": string | null,
  "observations": string[],
  "limitations": string[]
}
`;

    const ai = getAiClient();

    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [
                    {
                        parts: [
                            {
                                text: prompt,
                            },
                            {
                                inlineData: {
                                    mimeType,
                                    data: imageBuffer.toString("base64"),
                                },
                            },
                        ],
                    },
                ],
            });

            const text = response.text;

            if (!text) {
                throw new Error("No response text from image analysis AI");
            }

            const cleanedText = text
                .replace(/^```json\s*/i, "")
                .replace(/^```\s*/i, "")
                .replace(/\s*```$/i, "")
                .trim();

            return JSON.parse(cleanedText) as ImageAnalysisResult;

        } catch (error: any) {

            const isTimeout =
                error?.cause?.code === "ETIMEDOUT" ||
                /fetch failed|timed out/i.test(String(error));

            if (!isTimeout || attempt === maxRetries) {
                throw error;
            }

            await new Promise((resolve) =>
                setTimeout(resolve, attempt * 1000),
            );
        }
    }

    throw new Error("Image analysis failed after retries");
};