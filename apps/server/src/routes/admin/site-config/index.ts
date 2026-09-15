import { type FastifyPluginAsync } from 'fastify';
import { PublicRoutes } from '../../../constants/public-routes';

const AdminSiteConfig: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

    fastify.get('/profile', { onRequest: [fastify.authenticate] },
        async function (request, reply) {
            fastify.log.info(`Serving site config profile HTML for request to ${request.url}`);

            const siteConfig = await fastify.prisma.siteConfigs.findFirst();

            fastify.log.info(`Site config profile data: ${JSON.stringify(siteConfig)}`);


            return await reply.view(PublicRoutes.SITE_CONFIG_PROFILE, {
                siteConfig: siteConfig,
            });
        });

    fastify.get('/highlights', { onRequest: [fastify.authenticate] },
        async function (request, reply) {
            fastify.log.info(`Serving site config highlights HTML for request to ${request.url}`);
            const siteConfig = await fastify.prisma.siteConfigs.findFirst();
            return await reply.view(PublicRoutes.SITE_CONFIG_HIGHLIGHTS, {
                siteConfig: siteConfig,
            });
        });

    fastify.get('/social', { onRequest: [fastify.authenticate] },
        async function (request, reply) {
            fastify.log.info(`Serving site config social links HTML for request to ${request.url}`);
            const siteConfig = await fastify.prisma.siteConfigs.findFirst();
            return await reply.view(PublicRoutes.SITE_CONFIG_SOCIAL, {
                siteConfig: siteConfig,
            });
        });

    fastify.get('/contact', { onRequest: [fastify.authenticate] },
        async function (request, reply) {
            fastify.log.info(`Serving site config contact HTML for request to ${request.url}`);
            const siteConfig = await fastify.prisma.siteConfigs.findFirst();
            return await reply.view(PublicRoutes.SITE_CONFIG_CONTACT, {
                siteConfig: siteConfig,
            });
        });

    fastify.get('/about', { onRequest: [fastify.authenticate] },
        async function (request, reply) {
            fastify.log.info(`Serving site config about HTML for request to ${request.url}`);
            const siteConfig = await fastify.prisma.siteConfigs.findFirst();
            return await reply.view(PublicRoutes.SITE_CONFIG_ABOUT, {
                siteConfig: siteConfig,
            });
        });

}

export default AdminSiteConfig
