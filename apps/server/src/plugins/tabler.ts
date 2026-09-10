import path from 'node:path'
import { type FastifyPluginAsync } from 'fastify'
import fastifyStatic from '@fastify/static'

const staticPlugin: FastifyPluginAsync = async (fastify) => {
    try {
        await fastify.register(fastifyStatic, {
            root: path.join(process.cwd(), 'node_modules/@tabler/core/dist'),
            prefix: '/assets/tabler/',
            decorateReply: false,
        })
        fastify.log.info('Tabler static assets registered successfully');

        await fastify.register(fastifyStatic, {
            root: path.join(process.cwd(), 'public'),
            prefix: '/',
            decorateReply: false,
        })
        fastify.log.info('Public static assets registered successfully');
    } catch (err) {
        fastify.log.error(`Error registering static plugin: ${err}`);
        throw err;
    }
}

export default staticPlugin