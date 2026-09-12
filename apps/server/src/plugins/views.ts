import fp from 'fastify-plugin';
import fastifyView from '@fastify/view';
import nunjucks from 'nunjucks';
import path from 'path';

export default fp(async (fastify, opts) => {
    try {
        // Point to project root -> views
        const viewsPath = path.join(process.cwd(), 'views');
        
        // Log the exact path to verify it in your terminal logs
        fastify.log.info(`Registering views path: ${viewsPath}`);

        await fastify.register(fastifyView, {
            engine: {
                nunjucks,
            },
            root: viewsPath,
            // Expressing options explicitly prevents template loading ambiguity
            options: {
                noCache: process.env.NODE_ENV !== 'production',
            }
        });

        fastify.log.info('View plugin registered successfully');
    } catch (err) {
        fastify.log.error(`Error registering view plugin: ${err}`);
        throw err;
    }
});