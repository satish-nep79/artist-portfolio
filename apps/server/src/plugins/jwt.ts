import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'

import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { buildErrorResponse } from '../schemas/response';

declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: {
            id: string
            email: string
            tokenId: string
        }
        user: {
            id: string
            email: string
            tokenId: string
        }
    }
}

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (
            request: import('fastify').FastifyRequest,
            reply: import('fastify').FastifyReply
        ) => Promise<void>
    }
}

// Helper function to map JWT errors to user-friendly messages
const getJwtErrorMessage = (err: unknown): string => {
    if (!err || typeof err !== 'object') {
        return 'Unauthorized';
    }

    const errorSource = err as { code?: string; message?: string };

    // Map error identifiers (codes or messages) directly to friendly descriptions
    const errorMap: Record<string, string> = {
        'FST_JWT_NO_AUTHORIZATION_IN_HEADER': 'No authorization token provided',
        'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED': 'Token has expired',
        'FST_JWT_AUTHORIZATION_TOKEN_INVALID': 'Invalid signature or token structure',
        'TokenRevoked': 'Session expired or logged in from another device',
        'UserNotFound': 'Authenticated user no longer exists',
    };

    // Match against code first (Fastify-JWT), then custom thrown message string
    return (errorSource.code ? errorMap[errorSource.code] : null)
        || (errorSource.message ? errorMap[errorSource.message] : null)
        || 'Unauthorized';
};

/* 
* A Fastify plugin for JWT authentication
* Validated the JWT token and checks if the tokenId matches the one stored in the database for the user.
* If the token is invalid or the tokenId does not match, 
* it returns a 401 Unauthorized response for API routes 
* or redirects to the login page for HTML web routes.
*/
export default fp(async (fastify) => {
    const secret = process.env.JWT_SECRET
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is not set')
    }

    await fastify.register(jwt, {
        secret: process.env.JWT_SECRET!
    })

    // Add custom authentication decorator
    fastify.decorate('authenticate', async (request, reply) => {
        try {

            fastify.log.info(`Authenticating request for ${request.url}`)
            await request.jwtVerify();

            fastify.log.info(`JWT verified for user: ${request.user.email}`)
            const user = await fastify.prisma.user.findUnique({
                where: { id: request.user.id },
                select: { tokenId: true }
            })

            if (!user) {
                throw new Error('UserNotFound');
            }

            if (user.tokenId !== request.user.tokenId) {
                throw new Error('TokenRevoked');
            }

        } catch (err) {

            fastify.log.info(`Authentication failed for request to ${request.url}: ${err}`)

            // Check if the request is for an API route or expects JSON
            const isApiRoute = request.url.startsWith('/api') ||
                request.headers.accept?.includes('application/json')

            if (isApiRoute) {
                // Return 401 JSON response for API endpoints
                return reply.status(401).send(buildErrorResponse({ status: 401, message: getJwtErrorMessage(err) }))
            } else {
                const html = await readFile(
                    path.join(process.cwd(), 'public/admin/login.html'),
                    'utf8'
                )

                // Redirect browser to login page for HTML web routes
                return reply.type('text/html').send(html)
            }
        }
    })
})