import type { RepairReplaceAnalysisResult } from "./repair-replace-analysis.service.js";
import type {
    CostRange,
    RepairReplaceCalculation,
} from "../models/repair-replace.model.js";

export type RepairReplaceCalculationResult = RepairReplaceCalculation;

export const calculateRepairReplace = (
    analysis: RepairReplaceAnalysisResult,
): RepairReplaceCalculationResult => {
    /*
     * --------------------------------------------------
     * 1. Calculate MATERIAL COST
     * --------------------------------------------------
     */

    const requiredMaterials = analysis.repair.materials.filter(
        (material) => material.required,
    );

    const materialCost = requiredMaterials.reduce(
        (total, material) => {
            return {
                min: total.min + material.estimatedPrice.min,
                max: total.max + material.estimatedPrice.max,
                average: total.average + material.estimatedPrice.average,
            };
        },
        {
            min: 0,
            max: 0,
            average: 0,
        },
    );

    /*
     * --------------------------------------------------
     * 2. Calculate REQUIRED TOOL COST
     * --------------------------------------------------
     */

    const requiredTools = analysis.repair.tools.filter(
        (tool) => tool.required,
    );

    const toolCost = requiredTools.reduce(
        (total, tool) => {
            return {
                min: total.min + tool.estimatedPrice.min,
                max: total.max + tool.estimatedPrice.max,
                average: total.average + tool.estimatedPrice.average,
            };
        },
        {
            min: 0,
            max: 0,
            average: 0,
        },
    );

    /*
     * --------------------------------------------------
     * 3. DIY REPAIR COST
     *
     * Materials + required tools
     * --------------------------------------------------
     */

    const diyRepairCost: CostRange = {
        min: materialCost.min + toolCost.min,
        max: materialCost.max + toolCost.max,
        average: materialCost.average + toolCost.average,
    };

    /*
     * --------------------------------------------------
     * 4. PROFESSIONAL REPAIR COST
     *
     * Materials + professional labor
     *
     * Tools are NOT included because a professional
     * should already have the required tools.
     * --------------------------------------------------
     */

    const laborCost = analysis.repair.cost.professionalLabor;

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

    const replacementCost = analysis.replacement.cost;

    /*
     * --------------------------------------------------
     * 6. COST RATIOS
     *
     * Example:
     *
     * Repair = ₹335
     * Replace = ₹1750
     *
     * 335 / 1750 = 0.1914
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

    const professionalRepairCostPercentage =
        professionalRepairCostRatio * 100;

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

    /*
     * COST SCORE
     *
     * Lower repair cost compared to replacement
     * = higher repair score.
     *
     * Example:
     *
     * Repair = 20% of replacement
     * Cost score = 80
     */
    const costScore = analysis.repair.possible
        ? Math.max(
            0,
            Math.min(100, 100 - diyRepairCostPercentage),
        )
        : 0;

    /*
     * FEASIBILITY SCORE
     */
    const feasibilityScore = analysis.repair.possible
        ? 100
        : 0;

    /*
     * DIFFICULTY SCORE
     *
     * Gemini:
     * 0 = easy
     * 100 = extremely difficult
     *
     * We invert it because an easier repair
     * should receive a higher repair score.
     */
    const difficultyScore = analysis.repair.possible
        ? Math.max(
            0,
            Math.min(
                100,
                100 - analysis.repair.difficulty.score,
            ),
        )
        : 0;

    /*
     * SAFETY SCORE
     *
     * Gemini:
     * 0 = very safe
     * 100 = very dangerous
     *
     * We invert it.
     */
    const safetyScore = analysis.repair.possible
        ? Math.max(
            0,
            Math.min(
                100,
                100 - analysis.safety.score,
            ),
        )
        : 0;

    /*
     * --------------------------------------------------
     * 9. WEIGHTED REPAIR SCORE
     * --------------------------------------------------
     *
     * Cost        = 40%
     * Feasibility = 25%
     * Difficulty  = 20%
     * Safety      = 15%
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

    if (!analysis.repair.possible && !analysis.replacement.possible) {
        recommendation = "neither";
    } else if (!analysis.repair.possible) {
        recommendation = "replace";
    } else if (!analysis.replacement.possible) {
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
    return Math.round(value * 100) / 100;
};

const roundCost = (cost: CostRange): CostRange => {
    return {
        min: Math.round(cost.min),
        max: Math.round(cost.max),
        average: Math.round(cost.average),
    };
};