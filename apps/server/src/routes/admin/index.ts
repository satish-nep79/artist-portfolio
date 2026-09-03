import { type FastifyPluginAsync } from 'fastify';
import { PublicRoutes, PublicHtmlFiles } from '../../constants/public-routes';

const AdminDashboard: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/',
        { onRequest: [fastify.authenticate] },
        async function (request, reply) {

            fastify.log.info(`Serving dashboard HTML for request to ${request.url}`);
            const html = await PublicHtmlFiles.getHtml(PublicRoutes.DASHBOARD, { cache: true });
            return reply.type('text/html').send(html)
        })
}

export default AdminDashboard
