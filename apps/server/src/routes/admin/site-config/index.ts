import { type FastifyPluginAsync } from 'fastify';
import { PublicRoutes } from '../../../constants/public-routes';

const AdminSiteConfig: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

    fastify.get('/profile', { onRequest: [fastify.authenticate] },
        async function (request, reply) {
            fastify.log.info(`Serving site config profile HTML for request to ${request.url}`);
            return await reply.view(PublicRoutes.SITE_CONFIG_PROFILE);
        });

    fastify.get('/highlights', { onRequest: [fastify.authenticate] },
        async function (request, reply) {
            fastify.log.info(`Serving site config highlights HTML for request to ${request.url}`);
            return await reply.view(PublicRoutes.SITE_CONFIG_HIGHLIGHTS);
        });

    fastify.get('/social', { onRequest: [fastify.authenticate] },
        async function (request, reply) {
            fastify.log.info(`Serving site config social links HTML for request to ${request.url}`);
            return await reply.view(PublicRoutes.SITE_CONFIG_SOCIAL);
        });

    fastify.get('/contact', { onRequest: [fastify.authenticate] },
        async function (request, reply) {
            fastify.log.info(`Serving site config contact HTML for request to ${request.url}`);
            return await reply.view(PublicRoutes.SITE_CONFIG_CONTACT);
        });

    fastify.get('/about', { onRequest: [fastify.authenticate] },
        async function (request, reply) {
            fastify.log.info(`Serving site config about HTML for request to ${request.url}`);
            return await reply.view(PublicRoutes.SITE_CONFIG_ABOUT);
        });

}

export default AdminSiteConfig
