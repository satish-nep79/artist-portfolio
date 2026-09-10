import { type FastifyPluginAsync } from 'fastify';
import { PublicRoutes, PublicHtmlFiles } from '../../constants/public-routes';

const AdminDashboard: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/',
        { onRequest: [fastify.authenticate] },
        async function (request, reply) {

            fastify.log.info(`Serving dashboard HTML for request to ${request.url}`);
            const html = await PublicHtmlFiles.getHtml(PublicRoutes.DASHBOARD, { cache: false });
            return reply.type('text/html').send(html)
        })

    fastify.get('/login', async function (request, reply) {
        fastify.log.info(`Serving login HTML for request to ${request.url}`)
        // const html = await PublicHtmlFiles.getHtml(PublicRoutes.LOGIN, { cache: false })
        
        fastify.log.info(`Serving login HTML for request to ${request.url}`)

        return reply.view('auth/login.njk');
    })

}

export default AdminDashboard
