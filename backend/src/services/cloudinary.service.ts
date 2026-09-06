import type { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary.js";

export const uploadImage = (
    buffer: Buffer,
): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "repair-before-replace"
            },
            (error, result) => {
                if(error){
                    reject(error);
                }else {
                    resolve(result as UploadApiResponse);
                }
            }
        );
        uploadStream.end(buffer);
    });
};

export const deleteImage = async (publicId: string) => {
    return await cloudinary.uploader.destroy(publicId);
};