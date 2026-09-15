import { v2 as cloudinary } from 'cloudinary';
import { randomUUID } from 'crypto';
import { Readable } from 'stream';

export interface UploadStreamOptions {
    fileStream: Readable;
    folder?: string;
    hasUniqueFilename?: boolean;
    overwrite?: boolean;
}

export interface UploadResult {
    url: string;
    publicId: string;
}

export class ImageUploadService {
    constructor() {
        // Configure Cloudinary when the service is instantiated
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true,
        });
    }

    /**
     * Uploads a file stream directly to Cloudinary
     */
    async uploadStream(options: UploadStreamOptions): Promise<UploadResult> {

        const {
            fileStream,
            folder = 'artwork',
            hasUniqueFilename = true,
            overwrite = false,
        } = options;

        const rootFolder = process.env.CLOUDINARY_UPLOAD_FOLDER || 'artist-portfolio';
        const uploadFolder = `${rootFolder}/${folder}`;
        const uniqueFilename = `${folder}_${randomUUID()}`;


        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: uploadFolder,
                    resource_type: 'image',
                    public_id: hasUniqueFilename ? uniqueFilename : folder,
                    unique_filename: false, // We are generating our own unique filename
                    overwrite: overwrite,
                },
                (error, result) => {
                    if (error || !result) {
                        return reject(error || new Error('Cloudinary upload failed'));
                    }
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                    });
                }
            );

            fileStream.on('limit', () => {
                uploadStream.destroy(); // Cancel Cloudinary connection immediately
                reject(new Error('LIMIT_FILE_SIZE'));
            });

            fileStream.on('error', (streamErr) => reject(streamErr));
            fileStream.pipe(uploadStream);
        });
    }

    /**
     * Deletes an image from Cloudinary using its public_id
     */
    async deleteImage(publicId: string): Promise<boolean> {
        const result = await cloudinary.uploader.destroy(publicId);
        return result.result === 'ok';
    }
}