import mongoose from "mongoose";

const inputSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["description", "image"],
            required: true
        },

        content: {
            type: String
        },

        imageUrl: {
            type: String
        },

        publicId: {
            type: String
        }
    },{
        timestamps: true
    }
);

const analysisSchema = new mongoose.Schema(
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
        }
    },
    {
        timestamps: true
    }
);

analysisSchema.index(
    {updatedAt: 1},
    {expireAfterSeconds: 86400} //24 hours in seconds
);

export const Analysis = mongoose.model("Analysis", analysisSchema);