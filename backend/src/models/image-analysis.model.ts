import mongoose from "mongoose";

export interface IImageAnalysis {
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

