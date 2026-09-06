import { Analysis } from "../models/analysis.model.js";
import { deleteImage } from "../services/cloudinary.service.js";

export  const cleanupExpiredAnalyses = async () => {
    try {

        const expiredSessions = await Analysis.find({
            expiresAt: { $lte: new Date()}
        });
        
        for (const session of expiredSessions) {
            for (const input of session.inputs) {
                if(input.type === "image" && input.publicId) {
                    try {

                        await deleteImage(input.publicId);
                        console.log(`Deleted image with publicId: ${input.publicId}`);

                    }catch (error) {
                        console.error(`Failed to delete image with publicId: ${input.publicId}`, error);
                    }
                }
            }
            await Analysis.deleteMany({
                _id: session._id
            });

            console.log(`Deleted analysis with ID: ${session._id}`);
        }

    }catch (error) {
        console.error("Error during cleanup of expired analyses:", error);
    }
}