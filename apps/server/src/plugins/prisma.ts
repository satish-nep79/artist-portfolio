import fp from 'fastify-plugin';
import { PrismaClient } from '../generated/prisma/client';

declare module 'fastify' {
    export interface FastifyInstance {
        prisma: PrismaClient;
    }
}

export default fp(async (fastify, opts) => {
    fastify.log.info('Registering Prisma plugin ...');

    fastify.decorate('prisma', new PrismaClient());

    fastify.log.info('Connecting to the database ...');
    await fastify.prisma.$connect();

    fastify.log.info('Prisma plugin registered successfully.');

    fastify.addHook('onClose', async (instance) => {
        fastify.log.info('Disconnecting from the database ...');
        await instance.prisma.$disconnect();
        fastify.log.info('Disconnected from the database.');
    });
});