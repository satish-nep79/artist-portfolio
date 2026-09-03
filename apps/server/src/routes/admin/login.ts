import { type FastifyPluginAsync } from 'fastify'
import { PublicRoutes, PublicHtmlFiles } from '../../constants/public-routes'

const adminLogin: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/login', async function (request, reply) {
    fastify.log.info(`Serving login HTML for request to ${request.url}`)
    const html = await PublicHtmlFiles.getHtml(PublicRoutes.LOGIN, { cache: true })

    return reply.type('text/html').send(html)
  })
}

export default adminLogin