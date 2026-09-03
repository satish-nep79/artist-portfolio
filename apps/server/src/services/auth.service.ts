// src/services/auth.service.ts
import type { FastifyInstance } from 'fastify'

type UserPayload = {
    id: string
    email: string
    tokenId: string
}

export async function createAuthToken(
    fastify: FastifyInstance,
    user: UserPayload
) {
    return fastify.jwt.sign(
        {
            id: user.id,
            email: user.email,
            tokenId: user.tokenId,
        },
        {
            expiresIn: '1h',
        }
    )
}
