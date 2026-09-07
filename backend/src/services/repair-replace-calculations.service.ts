import type { RepairReplaceAnalysisResult } from "./repair-replace-analysis.service.js";
import type {
    CostRange,
    RepairReplaceCalculation,
} from "../models/repair-replace.model.js";

export type RepairReplaceCalculationResult = RepairReplaceCalculation;

const normalizeCostRange = (range?: Partial<CostRange> | null): CostRange => {
    const min = typeof range?.min === "number" && !isNaN(range.min) ? range.min : 0;
    const max = typeof range?.max === "number" && !isNaN(range.max) ? range.max : min;
    const average =
        typeof range?.average === "number" && !isNaN(range.average)
            ? range.average
            : (min + max) / 2;
    return { min, max, average };
};

export const calculateRepairReplace = (
    analysis: RepairReplaceAnalysisResult,
): RepairReplaceCalculationResult => {
    const repair = analysis?.repair || {
        possible: false,
        difficulty: { score: 100, level: "not_possible" as const },
        cost: {
            materials: { min: 0, max: 0, average: 0 },
            tools: { min: 0, max: 0, average: 0 },
            professionalLabor: { min: 0, max: 0, average: 0 },
        },
        time: { minMinutes: 0, maxMinutes: 0, averageMinutes: 0 },
        tools: [],
        materials: [],
        steps: [],
    };

    const replacement = analysis?.replacement || {
        possible: true,
        cost: { min: 0, max: 0, average: 0 },
        time: { minDays: 0, maxDays: 0, averageDays: 0 },
        reason: "Replacement assessment",
    };

    const safety = analysis?.safety || {
        score: 0,
        level: "low" as const,
        warning: null,
    };

    /*
     * --------------------------------------------------
     * 1. Calculate MATERIAL COST
     * --------------------------------------------------
     */

    const materialsList = Array.isArray(repair.materials) ? repair.materials : [];
    const requiredMaterials = materialsList.filter((m) => m && m.required);

    let materialCost: CostRange;

    if (requiredMaterials.length > 0) {
        materialCost = requiredMaterials.reduce<CostRange>(
            (total, material) => {
                const price = normalizeCostRange(material.estimatedPrice);
                return {
                    min: total.min + price.min,
                    max: total.max + price.max,
                    average: total.average + price.average,
                };
            },
            { min: 0, max: 0, average: 0 },
        );
    } else if (repair.cost?.materials) {
        materialCost = normalizeCostRange(repair.cost.materials);
    } else {
        materialCost = { min: 0, max: 0, average: 0 };
    }

    /*
     * --------------------------------------------------
     * 2. Calculate REQUIRED TOOL COST
     * --------------------------------------------------
     */

    const toolsList = Array.isArray(repair.tools) ? repair.tools : [];
    const requiredTools = toolsList.filter((t) => t && t.required);

    let toolCost: CostRange;

    if (requiredTools.length > 0) {
        toolCost = requiredTools.reduce<CostRange>(
            (total, tool) => {
                const price = normalizeCostRange(tool.estimatedPrice);
                return {
                    min: total.min + price.min,
                    max: total.max + price.max,
                    average: total.average + price.average,
                };
            },
            { min: 0, max: 0, average: 0 },
        );
    } else if (repair.cost?.tools) {
        toolCost = normalizeCostRange(repair.cost.tools);
    } else {
        toolCost = { min: 0, max: 0, average: 0 };
    }

    /*
     * --------------------------------------------------
     * 3. DIY REPAIR COST (Materials + required tools)
     * --------------------------------------------------
     */

    const diyRepairCost: CostRange = {
        min: materialCost.min + toolCost.min,
        max: materialCost.max + toolCost.max,
        average: materialCost.average + toolCost.average,
    };

    /*
     * --------------------------------------------------
     * 4. PROFESSIONAL REPAIR COST (Materials + professional labor)
     * --------------------------------------------------
     */

    const laborCost = normalizeCostRange(repair.cost?.professionalLabor);

    const professionalRepairCost: CostRange = {
        min: materialCost.min + laborCost.min,
        max: materialCost.max + laborCost.max,
        average: materialCost.average + laborCost.average,
    };

    /*
     * --------------------------------------------------
     * 5. REPLACEMENT COST
     * --------------------------------------------------
     */

    const replacementCost = normalizeCostRange(replacement.cost);

    /*
     * --------------------------------------------------
     * 6. COST RATIOS
     * --------------------------------------------------
     */

    const diyRepairCostRatio =
        replacementCost.average > 0
            ? diyRepairCost.average / replacementCost.average
            : 1;

    const professionalRepairCostRatio =
        replacementCost.average > 0
            ? professionalRepairCost.average / replacementCost.average
            : 1;

    const diyRepairCostPercentage = diyRepairCostRatio * 100;
    const professionalRepairCostPercentage = professionalRepairCostRatio * 100;

    /*
     * --------------------------------------------------
     * 7. COST SAVINGS
     * --------------------------------------------------
     */

    const diySavingsAmount =
        replacementCost.average - diyRepairCost.average;

    const professionalSavingsAmount =
        replacementCost.average - professionalRepairCost.average;

    const diySavingsPercentage =
        replacementCost.average > 0
            ? (diySavingsAmount / replacementCost.average) * 100
            : 0;

    const professionalSavingsPercentage =
        replacementCost.average > 0
            ? (professionalSavingsAmount / replacementCost.average) * 100
            : 0;

    /*
     * --------------------------------------------------
     * 8. SCORE EACH FACTOR
     * --------------------------------------------------
     */

    const isRepairPossible = Boolean(repair.possible);

    const costScore = isRepairPossible
        ? Math.max(0, Math.min(100, 100 - diyRepairCostPercentage))
        : 0;

    const feasibilityScore = isRepairPossible ? 100 : 0;

    const difficultyScore = isRepairPossible
        ? Math.max(
              0,
              Math.min(
                  100,
                  100 - (typeof repair.difficulty?.score === "number" ? repair.difficulty.score : 50),
              ),
          )
        : 0;

    const safetyScore = isRepairPossible
        ? Math.max(
              0,
              Math.min(
                  100,
                  100 - (typeof safety.score === "number" ? safety.score : 50),
              ),
          )
        : 0;

    /*
     * --------------------------------------------------
     * 9. WEIGHTED REPAIR SCORE
     * --------------------------------------------------
     */

    const repairScore =
        costScore * 0.40 +
        feasibilityScore * 0.25 +
        difficultyScore * 0.20 +
        safetyScore * 0.15;

    const replaceScore = 100 - repairScore;

    /*
     * --------------------------------------------------
     * 10. FINAL RECOMMENDATION
     * --------------------------------------------------
     */

    let recommendation: "repair" | "replace" | "both" | "neither";

    if (!repair.possible && !replacement.possible) {
        recommendation = "neither";
    } else if (!repair.possible) {
        recommendation = "replace";
    } else if (!replacement.possible) {
        recommendation = "repair";
    } else if (repairScore >= 65) {
        recommendation = "repair";
    } else if (repairScore <= 35) {
        recommendation = "replace";
    } else {
        recommendation = "both";
    }

    /*
     * --------------------------------------------------
     * 11. RETURN
     * --------------------------------------------------
     */

    return {
        repairCost: {
            diy: roundCost(diyRepairCost),
            professional: roundCost(professionalRepairCost),
        },

        replacementCost: roundCost(replacementCost),

        comparison: {
            diyRepairCostRatio: round(diyRepairCostRatio),
            diyRepairCostPercentage: round(diyRepairCostPercentage),

            professionalRepairCostRatio: round(
                professionalRepairCostRatio,
            ),

            professionalRepairCostPercentage: round(
                professionalRepairCostPercentage,
            ),

            diySavings: {
                amount: round(diySavingsAmount),
                percentage: round(diySavingsPercentage),
            },

            professionalSavings: {
                amount: round(professionalSavingsAmount),
                percentage: round(professionalSavingsPercentage),
            },
        },

        scores: {
            repair: round(repairScore),
            replace: round(replaceScore),

            factors: {
                cost: round(costScore),
                feasibility: round(feasibilityScore),
                difficulty: round(difficultyScore),
                safety: round(safetyScore),
            },
        },

        recommendation,
    };
};

const round = (value: number): number => {
    if (isNaN(value)) return 0;
    return Math.round(value * 100) / 100;
};

const roundCost = (cost: CostRange): CostRange => {
    return {
        min: Math.round(cost.min || 0),
        max: Math.round(cost.max || 0),
        average: Math.round(cost.average || 0),
    };
};