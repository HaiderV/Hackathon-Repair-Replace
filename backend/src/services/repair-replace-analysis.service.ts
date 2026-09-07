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

export const getAiClient = () => {
  // Load root .env first as fallback
  if (fs.existsSync(rootEnvPath)) dotenv.config({ path: rootEnvPath, override: true });
  // Load backend/.env / local .env with highest priority (overriding root)
  if (fs.existsSync(backendEnvPath)) dotenv.config({ path: backendEnvPath, override: true });
  if (fs.existsSync(localEnvPath)) dotenv.config({ path: localEnvPath, override: true });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY environment variable. Please ensure GEMINI_API_KEY is set in your backend/.env file.");
  }
  return new GoogleGenAI({ apiKey });
};

import type { RepairReplaceAnalysis } from "../models/repair-replace.model.js";

export type RepairReplaceAnalysisResult = RepairReplaceAnalysis;


export const analyzeRepairReplace = async (
  problemSummary: string,
  inputInformation: string,
): Promise<RepairReplaceAnalysisResult> => {
  const prompt = `

You are the repair and replacement assessment stage of a physical item
repair assistance system.

Your job is to analyze an already-understood physical item problem and
provide structured information about:

1. Whether the item can realistically be repaired.
2. What tools are required.
3. What materials or replacement parts are required.
4. Estimated repair costs.
5. Estimated repair time.
6. Repair difficulty.
7. Whether replacement is possible.
8. Estimated replacement cost.
9. Estimated replacement time.
10. Safety risks.

IMPORTANT:

- Do NOT ask questions or re-interview the user. Stage 1 has already collected the required problem information.
- Do NOT make the final repair-vs-replace recommendation.
- Do NOT calculate repair scores.
- Do NOT calculate replacement scores.
- Do NOT calculate cost ratios.
- Do NOT decide which option is better.
- The backend will perform those calculations.
- Return ONLY valid JSON.
- Do not use markdown.
- Do not wrap the JSON in code fences.
- Do not invent highly specific information when it is unknown.
- Costs must be estimates and must be represented as ranges.
- Currency must be INR.
- Use realistic approximate values rather than false precision.


For every tool, provide its own estimated purchase price.

Do not assume the user already owns the tool.

Tools are reusable and should be treated separately
from consumable repair materials.

professionalLabor represents the estimated cost if the
user takes the item to a professional repair service.

Do not include professional labor in the DIY repair cost.

IMPORTANT DISTINCTION BETWEEN REPAIR AND REPLACEMENT:

Repair means restoring the existing item or its existing components
through a repair process.

Do NOT classify simply buying a new component and installing it as
"repair".

For example:

- Buying a new charger adapter because the old adapter is faulty
  is replacement, not repair.
- Buying a new charging cable because the old cable is faulty
  is replacement, not repair.
- Replacing a broken zipper slider can be considered repair because
  the item itself is being restored using a replacement repair part.

If the proposed solution requires replacing most or all of the
original functional components, classify repair as not realistically
possible.

For electrical and mains-powered devices:

- Do not assume internal repair is safe for an ordinary user.
- A mains-powered charger adapter should generally not be treated
  as a DIY repair unless the problem clearly indicates a safe,
  simple external repair.
- If the adapter has an internal electrical failure and the user
  does not have specialized electronics repair capability,
  repair should be considered not realistically possible.
- Do not provide instructions for opening or repairing mains-powered
  adapters when doing so could expose the user to electrical hazards.

When both a charger adapter and its cable are faulty, do not classify
purchasing a new adapter and cable as a repair.

If the practical solution is to buy a new adapter and cable,
set:

"repair": {
  "possible": false
}

and explain why in the repair information.

DIFFICULTY SCORE:

The difficulty score must be between 0 and 100.

0-25   = easy
26-50  = moderate
51-75  = difficult
76-100 = extremely difficult

SAFETY SCORE:

The safety score must be between 0 and 100.

0-25   = low
26-60  = medium
61-100 = high

COST RULES:

- materials = estimated cost of required replacement parts/materials.
- tools = estimated cost of tools required for the repair.
- labor = estimated professional labor cost.
- Do not include the price of the entire replacement item in repair costs.
- If no labor is required for a DIY repair, labor may be 0.
- If a tool is commonly reusable, still provide its estimated purchase price.
- Do not assume that the user already owns any tools.

TIME RULES:

- Repair time must be represented in minutes.
- Replacement time must be represented in days.
- Use ranges rather than false precision.

TOOLS:

List every important tool required for the repair.

MATERIALS:

List every important material or replacement part required.

REPAIR STEPS:

Provide concise sequential steps.
Do not provide dangerous instructions when the safety risk is high.

REPLACEMENT:

Provide an estimated replacement price range for an equivalent item.
Do not recommend a specific commercial product.

For every material or replacement part, provide its own
estimated purchase price.

Every material must include:

min
max
average

Do not provide aggregate material prices only.

Optional materials must still have an estimated price,
but the backend will decide whether to include them
in the total repair cost.

REQUIRED JSON:

{
  "repair": {
    "possible": boolean,

    "difficulty": {
      "score": number,
      "level": "easy | moderate | difficult | not_possible"
    },

    "cost": {
      "materials": {
        "min": number,
        "max": number,
        "average": number
      },
      "tools": {
    "min": number,
    "max": number,
    "average": number
  },
  "professionalLabor": {
    "min": number,
    "max": number,
    "average": number
  }
},

    "time": {
      "minMinutes": number,
      "maxMinutes": number,
      "averageMinutes": number
    },

    "tools": [
      {
        "name": string,
        "required": boolean,
        "estimatedPrice": {
          "min": number,
          "max": number,
          "average": number 
        }
      }
    ],

  "materials": [
  {
    "name": string,
    "required": boolean,
    "estimatedPrice": {
      "min": number,
      "max": number,
      "average": number
    }
  }
],

    "steps": [string]
  },

  "replacement": {
    "possible": boolean,

    "cost": {
      "min": number,
      "max": number,
      "average": number
    },

    "time": {
      "minDays": number,
      "maxDays": number,
      "averageDays": number
    },

    "reason": string
  },

  "safety": {
    "score": number,
    "level": "low | medium | high",
    "warning": string | null
  }
}

PROBLEM SUMMARY:
${problemSummary}

USER INFORMATION:
${inputInformation}
`;

  const ai = getAiClient();
  const models = ["gemini-2.5-flash", "gemini-3.5-flash-lite", "gemini-2.5-pro"];
  let lastError: any = null;

  for (const modelName of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[Gemini] Requesting repair/replace analysis via model: ${modelName}...`);
        const response = await ai.models.generateContent({
          model: modelName,
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

        console.log(`[Gemini] Repair/replace analysis succeeded with model: ${modelName}`);
        return JSON.parse(cleanedText) as RepairReplaceAnalysisResult;
      } catch (error: any) {
        lastError = error;
        const isRateLimit = error?.status === 429 || /quota|resource_exhausted|429/i.test(String(error));
        const isNotFound = error?.status === 404 || /not found|404|no longer available/i.test(String(error));

        if (isRateLimit || isNotFound) {
          console.warn(`[Gemini] Model ${modelName} returned ${error?.status || "error"} (${error?.message}). Trying next fallback model...`);
          break; // Try next model immediately
        }

        const isTimeout =
          error?.cause?.code === "ETIMEDOUT" ||
          /fetch failed|timed out/i.test(String(error));

        if (!isTimeout || attempt === 2) {
          break;
        }

        const delay = attempt * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error("Gemini request failed after trying fallback models");
};