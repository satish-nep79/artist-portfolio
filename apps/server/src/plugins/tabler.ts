import path from 'node:path'
import { type FastifyPluginAsync } from 'fastify'
import fastifyStatic from '@fastify/static'

const staticPlugin: FastifyPluginAsync = async (fastify) => {
    await fastify.register(fastifyStatic, {
        root: path.join(process.cwd(), 'node_modules/@tabler/core/dist'),
        prefix: '/assets/tabler/',
        decorateReply: false,
    })
}

export default staticPlugin