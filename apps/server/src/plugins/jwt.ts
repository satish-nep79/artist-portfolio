import jwt, { FastifyJWT } from '@fastify/jwt';
import fp from 'fastify-plugin';
import { buildErrorResponse } from '../schemas/response';

// ==========================================
// 1. Module Type Augmentation
// ==========================================
declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: {
            id: string;
            email: string;
            tokenId: string;
        };
        user: {
            id: string;
            email: string;
            tokenId: string;
        };
    }
}

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (
            request: import('fastify').FastifyRequest,
            reply: import('fastify').FastifyReply
        ) => Promise<void>;
    }
}

// ==========================================
// 2. Constants & Helpers
// ==========================================
const JWT_ERROR_MAP: Record<string, string> = {
    FST_JWT_NO_AUTHORIZATION_IN_HEADER: 'No authorization token provided',
    FST_JWT_AUTHORIZATION_TOKEN_EXPIRED: 'Token has expired',
    FST_JWT_AUTHORIZATION_TOKEN_INVALID: 'Invalid signature or token structure',
    TokenRevoked: 'Session expired or logged in from another device',
    UserNotFound: 'Authenticated user no longer exists',
};

const getJwtErrorMessage = (err: unknown): string => {
    if (!err || typeof err !== 'object') return 'Unauthorized';
    const errorSource = err as { code?: string; message?: string };

    return (
        (errorSource.code ? JWT_ERROR_MAP[errorSource.code] : null) ||
        (errorSource.message ? JWT_ERROR_MAP[errorSource.message] : null) ||
        'Unauthorized'
    );
};


// ==========================================
// 3. Fastify JWT Plugin
// ==========================================
export default fp(async (fastify) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is not set');
    }

    await fastify.register(jwt, { secret });

    fastify.decorate('authenticate', async (request, reply) => {
        try {
            // Step A: Extract & verify JWT (Header first, fallback to Cookie)
            try {
                fastify.log.info(`Authenticating request for ${request.url}`);
                await request.jwtVerify();
            } catch (err) {
                const tokenFromCookie = request.cookies?.auth_token;
                if (!tokenFromCookie) {
                    fastify.log.info(`No token found in cookies for request to ${request.url}`);
                    throw err;
                }

                fastify.log.info(`Token found in cookies for request to ${request.url}, verifying...`);
                request.user = fastify.jwt.verify<FastifyJWT['user']>(tokenFromCookie);
            }

            fastify.log.info(`JWT verified for user: ${request.user.email}`);

            // Step B: Validate user status and active session in database
            const user = await fastify.prisma.user.findUnique({
                where: { id: request.user.id },
                select: { tokenId: true },
            });

            if (!user) {
                throw new Error('UserNotFound');
            }

            if (user.tokenId !== request.user.tokenId) {
                throw new Error('TokenRevoked');
            }
        } catch (err) {
            fastify.log.info(`Authentication failed for request to ${request.url}: ${err}`);

            // Step C: Handle authentication failure based on route type
            const isApiRoute =
                request.url.startsWith('/api') ||
                request.headers.accept?.includes('application/json');

            if (isApiRoute) {
                return reply
                    .status(401)
                    .send(buildErrorResponse({ status: 401, message: getJwtErrorMessage(err) }));
            }
            
            return reply.redirect('/admin/login').send();
        }
    });
});