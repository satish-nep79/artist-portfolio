import fp from 'fastify-plugin';
import fastifyView from '@fastify/view';
import nunjucks from 'nunjucks';
import path from 'path';

export default fp(async (fastify, opts) => {
    try {
        await fastify.register(fastifyView, {
            engine: {
                nunjucks,
            },
            root: path.join(__dirname, '../../views'),
        });
        fastify.log.info('View plugin registered successfully');
    } catch (err) {
        fastify.log.error(`Error registering view plugin: ${err}`);
        throw err;
    }
});