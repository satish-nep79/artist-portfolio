import { type FastifyPluginAsync } from 'fastify';
import { PublicRoutes } from '../../constants/public-routes';

const AdminRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/',
        { onRequest: [fastify.authenticate] },
        async function (request, reply) {

            fastify.log.info(`Serving dashboard HTML for request to ${request.url}`);
            return reply.redirect("/admin/dashboard");
        })

    fastify.get('/login', async function (request, reply) {

        fastify.log.info(`Serving login HTML for request to ${request.url}`)
        fastify.log.info(`Fetching Loging file`)
        return await reply.view(PublicRoutes.LOGIN);
    })



}

export default AdminRoutes
