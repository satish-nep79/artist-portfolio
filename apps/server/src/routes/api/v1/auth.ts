import { randomUUID } from 'node:crypto'
import { type FastifyPluginAsync } from 'fastify'
import { buildSuccessResponse, buildErrorResponse, standardApiResponseSchema } from '../../../schemas/response'
import { comparePassword } from '../../../util/password.util'
import { createAuthToken } from '../../../services/auth.service'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

    const bodySchema = {
        type: 'object',
        properties: {
            email: { type: 'string' },
            password: { type: 'string' },
        },
        required: ['email', 'password'],
    }

    fastify.post('/login', {
        schema: {
            body: bodySchema,
            response: standardApiResponseSchema,
        }
    }, async function (request, reply) {
        const { email, password } = request.body as { email: string, password: string }

        const user = await fastify.prisma.user.findUnique({ where: { email } })

        if (!user) {
            return reply.status(404).send(buildErrorResponse(404, 'Invalid email or password'))
        }

        const isPasswordValid = await comparePassword(user.passwordHash, password)

        if (!isPasswordValid) {
            return reply.status(401).send(buildErrorResponse(401, 'Invalid email or password'))
        }

        const tokenId = randomUUID()
        const token = await createAuthToken(fastify, { id: user.id, email: user.email, tokenId })
        const tokenExpiration = new Date(Date.now() + 60 * 60 * 1000)

        await fastify.prisma.user.update({ where: { id: user.id }, data: { tokenId } })

        return reply.status(200).send(buildSuccessResponse(200, 'Login successful', {
            token,
            expires_at: tokenExpiration.toISOString(),
        }))
    })
}

export default root
