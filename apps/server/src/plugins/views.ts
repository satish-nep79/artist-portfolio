import fp from 'fastify-plugin';
import fastifyView from '@fastify/view';
import nunjucks, { Environment } from 'nunjucks';
import path from 'path';

export default fp(async (fastify, opts) => {
    try {
        const viewsPath = path.join(process.cwd(), 'views');
        fastify.log.info(`Registering views path: ${viewsPath}`);

        await fastify.register(fastifyView, {
            engine: {
                nunjucks,
            },
            root: viewsPath,
            options: {
                noCache: process.env.NODE_ENV !== 'production',
                configure: (env: Environment) => {
                    env.addFilter('hasActiveChild', (children: { id: string }[], activePage: string) =>
                        children.some((child) => child.id === activePage)
                    );
                },
            },
        });

        fastify.log.info('View plugin registered successfully');
    } catch (err) {
        fastify.log.error(`Error registering view plugin: ${err}`);
        throw err;
    }
});