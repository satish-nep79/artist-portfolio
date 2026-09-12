import { type FastifyPluginAsync } from 'fastify';
import { PublicRoutes } from '../../constants/public-routes';
import { DEFAULT_ERROR_MESSAGES } from '../../constants/error-messages';

const AdminDashboard: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/',
        { onRequest: [fastify.authenticate] },
        async function (request, reply) {

            fastify.log.info(`Serving dashboard HTML for request to ${request.url}`);
            return await reply.view(PublicRoutes.DASHBOARD);
        })

    fastify.get('/login', async function (request, reply) {
        try {
            fastify.log.info(`Serving login HTML for request to ${request.url}`)
            fastify.log.info(`Fetching Loging file`)
            return await reply.view(PublicRoutes.LOGIN);
        } catch (err) {
            fastify.log.error(err);
            return reply.status(500).send(DEFAULT_ERROR_MESSAGES[500]);
        }
    })

}

export default AdminDashboard
