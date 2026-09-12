import { type FastifyPluginAsync } from 'fastify';
import { PublicRoutes } from '../../../constants/public-routes';

const AdminDashboard: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/',
        { onRequest: [fastify.authenticate] },
        async function (request, reply) {

            fastify.log.info(`Serving dashboard HTML for request to ${request.url}`);
            return await reply.view(PublicRoutes.DASHBOARD);
        })
}

export default AdminDashboard
