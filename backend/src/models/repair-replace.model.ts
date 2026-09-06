import mongoose from "mongoose";


// 1) Components schema
const costRangeSchema = new mongoose.Schema(
    {
        min: {
            type: Number,
            required: true,
        },

        max: {
            type: Number,
            required: true,
        },

        average: {
            type: Number,
            required: true,
        },
    },
    { _id: false },
);

const toolSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        required: {
            type: Boolean,
            required: true,
        },

        estimatedPrice: {
            type: costRangeSchema,
            required: true,
        },
    },
    { _id: false },
);

const materialSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        required: {
            type: Boolean,
            required: true,
        },

        estimatedPrice: {
            type: costRangeSchema,
            required: true,
        },
    },
    { _id: false },
);

// 2) Detail schemas

const difficultySchema = new mongoose.Schema(
    {
        score: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },

        level: {
            type: String,
            enum: ["easy", "moderate", "difficult", "not_possible"],
            required: true,
        },
    },
    { _id: false },
);

const repairCostSchema = new mongoose.Schema(
    {
        materials: {
            type: costRangeSchema,
            required: true,
        },

        tools: {
            type: costRangeSchema,
            required: true,
        },

        professionalLabor: {
            type: costRangeSchema,
            required: true,
        },
    },
    { _id: false },
);

const repairTimeSchema = new mongoose.Schema(
    {
        minMinutes: {
            type: Number,
            required: true,
        },

        maxMinutes: {
            type: Number,
            required: true,
        },

        averageMinutes: {
            type: Number,
            required: true,
        },
    },
    { _id: false },
);

const replacementTimeSchema = new mongoose.Schema(
    {
        minDays: {
            type: Number,
            required: true,
        },

        maxDays: {
            type: Number,
            required: true,
        },

        averageDays: {
            type: Number,
            required: true,
        },
    },
    { _id: false },
);

const repairDetailSchema = new mongoose.Schema(
    {
        possible: {
            type: Boolean,
            required: true,
        },

        difficulty: {
            type: difficultySchema,
            required: true,
        },

        cost: {
            type: repairCostSchema,
            required: true,
        },

        time: {
            type: repairTimeSchema,
            required: true,
        },

        tools: {
            type: [toolSchema],
            default: [],
        },

        materials: {
            type: [materialSchema],
            default: [],
        },

        steps: {
            type: [String],
            default: [],
        },
    },
    { _id: false },
);

const replacementDetailSchema = new mongoose.Schema(
    {
        possible: {
            type: Boolean,
            required: true,
        },

        cost: {
            type: costRangeSchema,
            required: true,
        },

        time: {
            type: replacementTimeSchema,
            required: true,
        },

        reason: {
            type: String,
            required: true,
        },
    },
    { _id: false },
);

const safetyDetailSchema = new mongoose.Schema(
    {
        score: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },

        level: {
            type: String,
            enum: ["low", "medium", "high"],
            required: true,
        },

        warning: {
            type: String,
            default: null,
        },
    },
    { _id: false },
);

// 3) Analysis Schema from the ai

const repairReplaceAnalysisSchema = new mongoose.Schema(
    {
        repair: {
            type: repairDetailSchema,
            required: true,
        },

        replacement: {
            type: replacementDetailSchema,
            required: true,
        },

        safety: {
            type: safetyDetailSchema,
            required: true,
        },
    },
    { _id: false },
);

// 4) Calculation subschemas

const calculationRepairCostSchema = new mongoose.Schema(
    {
        diy: {
            type: costRangeSchema,
            required: true,
        },

        professional: {
            type: costRangeSchema,
            required: true,
        },
    },
    { _id: false },
);

const savingsSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true,
        },

        percentage: {
            type: Number,
            required: true,
        },
    },
    { _id: false },
);

const comparisonSchema = new mongoose.Schema(
    {
        diyRepairCostRatio: {
            type: Number,
            required: true,
        },

        diyRepairCostPercentage: {
            type: Number,
            required: true,
        },

        professionalRepairCostRatio: {
            type: Number,
            required: true,
        },

        professionalRepairCostPercentage: {
            type: Number,
            required: true,
        },

        diySavings: {
            type: savingsSchema,
            required: true,
        },

        professionalSavings: {
            type: savingsSchema,
            required: true,
        },
    },
    { _id: false },
);

const scoreFactorsSchema = new mongoose.Schema(
    {
        cost: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },

        feasibility: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },

        difficulty: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },

        safety: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
    },
    { _id: false },
);

const scoresSchema = new mongoose.Schema(
    {
        repair: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },

        replace: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },

        factors: {
            type: scoreFactorsSchema,
            required: true,
        },
    },
    { _id: false },
);

// 5) Calculation schema done by the backend

const repairReplaceCalculationSchema = new mongoose.Schema(
    {
        repairCost: {
            type: calculationRepairCostSchema,
            required: true,
        },

        replacementCost: {
            type: costRangeSchema,
            required: true,
        },

        comparison: {
            type: comparisonSchema,
            required: true,
        },

        scores: {
            type: scoresSchema,
            required: true,
        },

        recommendation: {
            type: String,
            enum: ["repair", "replace", "both", "neither"],
            required: true,
        },
    },
    { _id: false },
);

export interface CostRange {
    min: number;
    max: number;
    average: number;
}

export interface Tool {
    name: string;
    required: boolean;
    estimatedPrice: CostRange;
}

export interface Material {
    name: string;
    required: boolean;
    estimatedPrice: CostRange;
}

export interface RepairDifficulty {
    score: number;
    level: "easy" | "moderate" | "difficult" | "not_possible";
}

export interface RepairCost {
    materials: CostRange;
    tools: CostRange;
    professionalLabor: CostRange;
}

export interface RepairTime {
    minMinutes: number;
    maxMinutes: number;
    averageMinutes: number;
}

export interface ReplacementTime {
    minDays: number;
    maxDays: number;
    averageDays: number;
}

export interface RepairDetail {
    possible: boolean;
    difficulty: RepairDifficulty;
    cost: RepairCost;
    time: RepairTime;
    tools: Tool[];
    materials: Material[];
    steps: string[];
}

export interface ReplacementDetail {
    possible: boolean;
    cost: CostRange;
    time: ReplacementTime;
    reason: string;
}

export interface SafetyDetail {
    score: number;
    level: "low" | "medium" | "high";
    warning: string | null;
}

export interface RepairReplaceAnalysis {
    repair: RepairDetail;
    replacement: ReplacementDetail;
    safety: SafetyDetail;
}

export interface CalculationRepairCost {
    diy: CostRange;
    professional: CostRange;
}

export interface Savings {
    amount: number;
    percentage: number;
}

export interface Comparison {
    diyRepairCostRatio: number;
    diyRepairCostPercentage: number;
    professionalRepairCostRatio: number;
    professionalRepairCostPercentage: number;
    diySavings: Savings;
    professionalSavings: Savings;
}

export interface ScoreFactors {
    cost: number;
    feasibility: number;
    difficulty: number;
    safety: number;
}

export interface Scores {
    repair: number;
    replace: number;
    factors: ScoreFactors;
}

export interface RepairReplaceCalculation {
    repairCost: CalculationRepairCost;
    replacementCost: CostRange;
    comparison: Comparison;
    scores: Scores;
    recommendation: "repair" | "replace" | "both" | "neither";
}

export {
    repairReplaceAnalysisSchema,
    repairReplaceCalculationSchema,
};