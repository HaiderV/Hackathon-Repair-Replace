import type { InputAnalysisResult } from "./input-analysis.service.js";

export interface ConfidenceResult {
    confidence: number;
    understood: boolean;
}

export const calculateConfidence = (
    result: InputAnalysisResult
): ConfidenceResult => {

    let confidence = 0;

    if (result.itemIdentified) {
        confidence += 25;
    }

    if (result.problemIdentified) {
        confidence += 35;
    }

    if (result.problemSpecific) {
        confidence += 25;
    }

    if (result.relevantContextPresent) {
        confidence += 15;
    }

    return {
        confidence,
        understood: confidence >= 85
    };
};