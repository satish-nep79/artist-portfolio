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

        fastify.log.info(`User login attempt: ${email}`)

        if (!user) {
            fastify.log.info(`User not found: ${email}`)
            return reply.status(404).send(buildErrorResponse({ status: 404, message: 'Invalid email or password' }))
        }

        const isPasswordValid = await comparePassword(user.passwordHash, password)

        if (!isPasswordValid) {
            return reply.status(401).send(buildErrorResponse({ status: 401, message: 'Invalid email or password' }))
        }

        const tokenId = randomUUID()
        const token = await createAuthToken(fastify, { id: user.id, email: user.email, tokenId })
        const tokenExpiration = new Date(Date.now() + 60 * 60 * 1000)

        await fastify.prisma.user.update({ where: { id: user.id }, data: { tokenId } })
        fastify.log.info(`User logged in: ${user.email}`)

        // Set the token in cookie with HttpOnly and Secure flags
        reply.setCookie(
            'auth_token', token,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                expires: tokenExpiration,
                maxAge: 60 * 60, // 1 hour in seconds
                path: '/',
            },
        );

        return reply.status(200).send(buildSuccessResponse({
            status: 200, message: 'Login successful ada', data: {
                token,
                expires_at: tokenExpiration.toISOString(),
            }
        }))
    })
}

export default root
