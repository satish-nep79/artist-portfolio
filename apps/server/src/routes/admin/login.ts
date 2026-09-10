import { type FastifyPluginAsync } from 'fastify'

const adminLogin: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/login', async function (request, reply) {
    // fastify.log.info(`Serving login HTML for request to ${request.url}`)
    // const html = await PublicHtmlFiles.getHtml(PublicRoutes.LOGIN, { cache: false })

    fastify.log.info(`Serving login HTML for request to ${request.url}`)

    return reply.view('auth/login.njk');
  })
}

export default adminLogin