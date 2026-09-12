import { type FastifyPluginAsync } from 'fastify'
import { PublicRoutes } from '../constants/public-routes';
import { DEFAULT_ERROR_MESSAGES } from '../constants/error-messages';

const RootRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

  fastify.get('/', async function (request, reply) {
    fastify.log.info(`Redirecting to /admin for request to ${request.url}`);
    return reply.redirect('/admin')
  })

  fastify.setNotFoundHandler(async (request, reply) => {
    const errorMessage = DEFAULT_ERROR_MESSAGES[404];

    fastify.log.info(`Request to ${request.url} not found, serving 404 page`);
    fastify.log.info(`Serving 404 page for request to ${request.url}`);
    return await reply.view(PublicRoutes.ERROR, {
      code: 404,
      title: 'Page Not Found',
      message: errorMessage,
      showBackBtn: true,
      primaryBtnText: 'Back to Login',
      primaryBtnLink: '/admin/login'
    });
  });

}

export default RootRoutes
