import { type FastifyPluginAsync } from 'fastify'
import { PublicHtmlFiles, PublicRoutes } from '../constants/public-routes';

const RootRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

  fastify.get('/', async function (request, reply) {
    fastify.log.info(`Redirecting to /admin for request to ${request.url}`);
    return reply.redirect('/admin')
  })

  fastify.setNotFoundHandler(async (request, reply) => {
    fastify.log.info(`Request to ${request.url} not found, serving 404 page`);
    fastify.log.info(`Serving 404 page for request to ${request.url}`);
    const html = await PublicHtmlFiles.getHtml(PublicRoutes.NO_PAGE_FOUND, { cache: true });
    return reply.status(404).type('text/html').send(html);
  });

}

export default RootRoutes
