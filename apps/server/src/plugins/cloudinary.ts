import fp from 'fastify-plugin';
import { ImageService } from '../services/image-upload.service';

// Module augmentation for TypeScript autocompletion
declare module 'fastify' {
    interface FastifyInstance {
        imageUpload: ImageService;
    }
}

export default fp(async (fastify) => {
    // 1. Boot-time check: Fail fast if credentials are missing
    if (
        !process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET
    ) {
        throw new Error('Missing Cloudinary configuration in environment variables');
    }

    // 2. Instantiate and attach service to Fastify instance
    const imageUploadService = new ImageService();
    fastify.decorate('imageUpload', imageUploadService);

    fastify.log.info('Cloudinary ImageUploadService has been registered successfully.');
});