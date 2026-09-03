import fp from 'fastify-plugin'
import cookie from '@fastify/cookie'

export default fp(async (fastify, opts) => {
    try {
        const cookieSecret = process.env.COOKIE_SECRET;
        await fastify.register(cookie, {
            secret: cookieSecret,
            hook: 'onRequest',
            parseOptions: {}
        })
    } catch (err) {
        fastify.log.error(`Error registering cookie plugin: ${err}`)
    }
})
