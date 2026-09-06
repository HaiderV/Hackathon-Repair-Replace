import mongoose from "mongoose";
import type { IImageAnalysis } from "./image-analysis.model.js";
import {
    repairReplaceAnalysisSchema,
    repairReplaceCalculationSchema,
    type RepairReplaceAnalysis,
    type RepairReplaceCalculation,
} from "./repair-replace.model.js";

export interface IInput {
    type: "description" | "image";
    content?: string;
    imageUrl?: string;
    publicId?: string;
    imageAnalysis?: IImageAnalysis;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IInputAnalysis {
    itemIdentified: boolean;
    problemIdentified: boolean;
    problemSpecific: boolean;
    relevantContextPresent: boolean;
    understood: boolean;
    confidence: number;
    problemSummary: string | null;
    missingInformation: string[];
    questions: string[];
    requiresImage: boolean;
    reason: string | null;
    itemName: string | null;
}

export interface IAnalysis {
    sessionId: string;
    inputs: IInput[];
    status: "collecting_information" | "ready_for_analysis" | "completed";
    expiresAt: Date;
    inputAnalysis: IInputAnalysis | null;
    repairReplaceAnalysis: RepairReplaceAnalysis | null;
    repairReplaceCalculation: RepairReplaceCalculation | null;
    createdAt?: Date;
    updatedAt?: Date;
    resources?: IResources;
}

export interface IResource {
    title: string;
    url: string;
    description: string;
    source: string;
    thumbnail?: string | undefined;
}

export interface IReplacementOptions {
    donate: IResource[];
    refurbish: IResource[];
    recycle: IResource[];
}

export interface IResources {
    repairGuides: IResource[];
    videos: IResource[];
    replacementOptions?: IReplacementOptions;
}

const imageAnalysisSchema = new mongoose.Schema(
    {
        imageRelevant: {
            type: Boolean,
            required: true,
        },

        itemVisible: {
            type: Boolean,
            required: true,
        },

        visibleDamage: {
            type: Boolean,
            required: true,
        },

        damageDescription: {
            type: String,
            default: null,
        },

        affectedComponent: {
            type: String,
            default: null,
        },

        visibleCondition: {
            type: String,
            default: null,
        },

        safetyConcern: {
            type: Boolean,
            required: true,
        },

        safetyWarning: {
            type: String,
            default: null,
        },

        observations: {
            type: [String],
            default: [],
        },

        limitations: {
            type: [String],
            default: [],
        },
    },
    {
        _id: false,
    }
);

const inputSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["description", "image"],
            required: true,
        },

        content: {
            type: String,
        },

        imageUrl: {
            type: String,
        },

        publicId: {
            type: String,
        },

        imageAnalysis: {
            type: imageAnalysisSchema,
            default: undefined,
        },
    },
    {
        timestamps: true,
    }
);

const inputAnalysisSchema = new mongoose.Schema(
    {

        itemIdentified: {
            type: Boolean,
            required: true
        },

        itemName: {
            type: String,
            default: null,
        },

        problemIdentified: {
            type: Boolean,
            required: true
        },

        problemSpecific: {
            type: Boolean,
            required: true
        },

        relevantContextPresent: {
            type: Boolean,
            required: true
        },

        understood: {
            type: Boolean,
            required: true
        },

        confidence: {
            type: Number,
            required: true
        },

        problemSummary: {
            type: String,
            default: null
        },

        missingInformation: {
            type: [String],
            default: []
        },

        questions: {
            type: [String],
            default: []
        },

        requiresImage: {
            type: Boolean,
            required: true
        },

        reason: {
            type: String,
            default: null
        }
    },
    { _id: false }
);

// Resource Schema :
const resourceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        url: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        source: {
            type: String,
            required: true,
        },

        thumbnail: {
            type: String,
        },
    },
    {
        _id: false,
    }
);

const replacementOptionsSchema = new mongoose.Schema(
    {
        donate: {
            type: [resourceSchema],
            default: [],
        },

        refurbish: {
            type: [resourceSchema],
            default: [],
        },

        recycle: {
            type: [resourceSchema],
            default: [],
        },
    },
    {
        _id: false,
    }
);

const resourcesSchema = new mongoose.Schema(
    {
        repairGuides: {
            type: [resourceSchema],
            default: [],
        },

        videos: {
            type: [resourceSchema],
            default: [],
        },

        replacementOptions: {
            type: replacementOptionsSchema,
            default: undefined,
        },
    },
    {
        _id: false,
    }
);

const analysisSchema = new mongoose.Schema<IAnalysis>(
    {
        sessionId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        inputs: {
            type: [inputSchema],
            default: []
        },

        status: {
            type: String,
            enum: [
                "collecting_information",
                "ready_for_analysis",
                "completed"
            ],
            default: "collecting_information"
        },

        expiresAt: {
            type: Date,
            required: true,
            index: true
        },
        inputAnalysis: {
            type: inputAnalysisSchema,
            default: null
        },
        repairReplaceAnalysis: {
            type: repairReplaceAnalysisSchema,
            default: null
        },
        repairReplaceCalculation: {
            type: repairReplaceCalculationSchema,
            default: null
        },
        resources: {
            type: resourcesSchema,
            default: undefined,
        }
    },
    {
        timestamps: true
    }
);

//TTL can be used 

// analysisSchema.index(
//     {updatedAt: 1},
//     {expireAfterSeconds: 86400} //24 hours in seconds
// );



export const Analysis = mongoose.model<IAnalysis>("Analysis", analysisSchema);