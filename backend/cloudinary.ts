import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';

// Ensure env vars are loaded
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(fileBuffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'medone_pharmacy',
            },
            (error, result) => {
                if (error) return reject(error);
                if (result) resolve(result.secure_url);
                else reject(new Error('Cloudinary upload failed with no result'));
            }
        );

        uploadStream.end(fileBuffer);
    });
}

export default cloudinary;
