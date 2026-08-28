import { type FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/auth', async function (request, reply) {
        return {
            title: 'Auth API',
            version: '1.0.0',
            description: 'This is the Auth API for the application.',
            endpoints: [
                {
                    method: 'POST',
                    path: '/login',
                    description: 'Endpoint for admin login.',
                    requestBody: {
                        type: 'object',
                        properties: {
                            username: { type: 'string' },
                            password: { type: 'string' },
                        },
                        required: ['username', 'password'],
                    },
                    responses: {
                        200: {
                            description: 'Successful login.',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            token: { type: 'string' },
                                        },
                                    },
                                }
                            }
                        }
                    }
                },
            ]
        }
    })
}

export default root
