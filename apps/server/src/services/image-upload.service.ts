import { v2 as cloudinary } from 'cloudinary';
import { randomUUID } from 'crypto';
import { Readable } from 'stream';

export type ImageVariantName = 'thumbnail' | 'standard' | 'full';

export interface TransformationOptions {
    variant?: ImageVariantName;
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'limit' | 'thumb' | 'scale';
    quality?: 'auto' | number;
    format?: 'auto' | 'jpg' | 'png' | 'webp';
}

export interface ImageVariants {
    thumbnail: string | null;  // w_300  (Small previews, admin lists, avatars)
    standard: string | null;   // w_600  (Cards, grid view, main display)
    full: string | null;       // w_2000 (Modal viewer, full-screen detail)
}

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

// Preset mapping for predefined variant widths
const VARIANT_PRESETS: Record<ImageVariantName, { width: number }> = {
    thumbnail: { width: 300 },
    standard: { width: 600 },
    full: { width: 2000 },
};

export class ImageService {
    private readonly cloudName: string;

    constructor() {
        this.cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
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
                    unique_filename: false,
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
                uploadStream.destroy();
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

    /**
     * Generates a transformed Cloudinary CDN URL from a publicId.
     * Accepts a preset variant string or custom width/height options.
     */
    getImageUrl(
        publicId: string | null | undefined,
        options: TransformationOptions = {}
    ): string | null {
        if (!publicId) return null;

        const {
            variant,
            crop = 'fill',
            quality = 'auto',
            format = 'auto',
        } = options;

        // Apply preset dimensions if a variant key was supplied
        const preset = variant ? VARIANT_PRESETS[variant] : undefined;
        const targetWidth = options.width ?? preset?.width;
        const targetHeight = options.height;

        const transforms: string[] = [
            `f_${format}`,
            `q_${quality}`,
        ];

        if (targetWidth) transforms.push(`w_${targetWidth}`);
        if (targetHeight) transforms.push(`h_${targetHeight}`);
        if (targetWidth || targetHeight) transforms.push(`c_${crop}`);

        const transformString = transforms.join(',');

        return `https://res.cloudinary.com/${this.cloudName}/image/upload/${transformString}/${publicId}`;
    }

    /**
     * Generates a predefined dictionary of URL variants for responsive layouts
     */
    getImageVariants(publicId: string | null | undefined): ImageVariants {
        return {
            thumbnail: this.getImageUrl(publicId, { variant: 'thumbnail' }),
            standard: this.getImageUrl(publicId, { variant: 'standard' }),
            full: this.getImageUrl(publicId, { variant: 'full' }),
        };
    }
}