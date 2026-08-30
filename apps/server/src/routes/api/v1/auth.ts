import fastify, { type FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

    const bodySchema = {
        type: 'object',
        properties: {
            username: { type: 'string' },
            password: { type: 'string' },
        },
        required: ['username', 'password'],
    }

    const responseSchema = {
        200: {
            type: 'object',
            properties: {
                status: { type: 'string' },
                success: { type: 'boolean' },
                token: { type: 'string' },
            },
        },
        401: {
            type: 'object',
            properties: {
                status: { type: 'string' },
                success: { type: 'boolean' },
                error: { type: 'string' },
            },
        },
        500: {
            type: 'object',
            properties: {
                status: { type: 'string' },
                success: { type: 'boolean' },
                error: { type: 'string' },
            },
        },
    }

    fastify.post('/auth', {
        schema: {
            body: bodySchema,
            response: responseSchema,
        }
    }, async function (request, reply) {

        return reply.send({ token: 'fake-jwt-token' })
    })

    fastify.get('/auth', { schema: { response: responseSchema } }, async function (request, reply) {
        return reply.send({})
    })
}

export default root
