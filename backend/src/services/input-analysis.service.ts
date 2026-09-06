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
    throw new Error("Missing GEMINI_API_KEY environment variable. Please ensure GEMINI_API_KEY is set in your .env file.");
  }
  return new GoogleGenAI({ apiKey });
};

export interface InputAnalysisResult {
  itemIdentified: boolean;
  itemName: string | null;
  problemIdentified: boolean;
  problemSpecific: boolean;
  relevantContextPresent: boolean;

  problemSummary: string | null;
  missingInformation: string[];
  questions: string[];
  requiresImage: boolean;
  reason: string | null;
}

export const analyzeInput = async (
  inputText: string,
): Promise<InputAnalysisResult> => {
  const prompt = `
You are the Stage 1 input-understanding stage of a physical item repair assistance system.

Your ONLY job is to determine whether the provided information is sufficient to understand what physical item is involved and what the physical problem/symptom is.

STRICT STAGE 1 BOUNDARIES:
- Do NOT provide repair instructions or repair steps.
- Do NOT recommend repair or replacement.
- Do NOT list required tools or materials.
- Do NOT estimate costs or times.
- Do NOT rate repair difficulty or feasibility.
- Do NOT assign a confidence score (the backend calculates confidence).
- Stage 1 only decides if we understand the problem well enough to proceed to assessment.

INFORMATION TO IDENTIFY:
1. itemIdentified (boolean): True if the physical item (e.g., backpack, smartphone charger, microwave, bicycle) is identified.
2. itemName (string | null): The concise, standard name of the physical item (e.g., "wooden chair", "backpack", "smartphone charger", "washing machine") if identified, otherwise null.
3. problemIdentified (boolean): True if the general problem or failure symptom (e.g., not powering on, zipper broken, leaking water) is stated.
4. problemSpecific (boolean): True if specific details about the component involved (e.g., adapter vs cable, zipper slider vs teeth) or specific physical failure mode are provided.
5. relevantContextPresent (boolean): True if relevant context (e.g., what happened before failure, testing already done like trying other sockets/devices, physical condition) is present.

MULTI-MESSAGE & QUESTION RULES:
- The input contains chronological messages from the user (Message 1, Message 2, etc.).
- Evaluate all messages together as one cumulative session.
- NEVER repeat a question that has already been answered in previous messages.
- If the user already clarified a detail (e.g., "both adapter and cable", "no visible damage"), treat that detail as known.
- Do NOT ask unnecessary or overly deep diagnostic questions.
- Once the physical item and the primary problem/components are clear enough to assess repair vs replace, do NOT ask further questions.
- If the user sends conversational filler, greetings, or irrelevant text after the problem was already described, PRESERVE the item and problem identification from earlier messages. Do NOT lose the established context.

IMAGE RULES:
- requiresImage (boolean): Set to true ONLY if a photograph of visible physical damage or condition would significantly help (e.g., broken zipper, cracked casing, torn seam).
- Set requiresImage to false if the issue is internal/electrical with no visible damage, or if an image would not add meaningful value.
- requiresImage = true does NOT mean the problem is not understood; it simply indicates a photo would be helpful.

RETURN FORMAT:
Return ONLY valid JSON matching this exact structure:

{
  "itemIdentified": boolean,
  "itemName": string | null,
  "problemIdentified": boolean,
  "problemSpecific": boolean,
  "relevantContextPresent": boolean,
  "problemSummary": string | null,
  "missingInformation": string[],
  "questions": string[],
  "requiresImage": boolean,
  "reason": string | null
}

If itemIdentified, problemIdentified, and problemSpecific are true, missingInformation and questions should be empty arrays ([]).

User's cumulative messages so far:
${inputText}
`;

  const ai = getAiClient();
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text = response.text;

      if (!text) {
        throw new Error("No response text from AI model");
      }

      const cleanedText = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      return JSON.parse(cleanedText) as InputAnalysisResult;
    } catch (error: any) {
      const isTimeout =
        error?.cause?.code === "ETIMEDOUT" ||
        /fetch failed|timed out/i.test(String(error));

      if (!isTimeout || attempt === maxRetries) {
        throw error;
      }

      const delay = attempt * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("Gemini request failed after retries");
};
