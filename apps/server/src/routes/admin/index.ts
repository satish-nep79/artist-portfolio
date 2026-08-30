import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { type FastifyPluginAsync } from 'fastify'

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/',
        { onRequest: [fastify.authenticate] },
        async function (request, reply) {
            const html = await readFile(
                path.join(process.cwd(), 'public/admin/login.html'),
                'utf8'
            )

            return reply.type('text/html').send(html)
        })
}

export default example
