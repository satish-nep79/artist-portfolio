import path from 'node:path';

const BASE_PAGE_DIR = 'page';

/**
 * Single source of truth for Nunjucks view template paths.
 * All paths are relative to the 'views' root directory configured in @fastify/view.
 */
export class PublicRoutes {
    // Error templates
    static readonly ERROR = path.join(BASE_PAGE_DIR, 'error', 'error.njk');

    // Page templates
    static readonly LOGIN = path.join(BASE_PAGE_DIR, 'auth', 'login.njk');
    static readonly DASHBOARD = path.join(BASE_PAGE_DIR, 'dashboard', 'dashboard.njk');
    static readonly SITE_CONFIG = path.join(BASE_PAGE_DIR, 'dashboard', 'site-config.njk');
}

export default PublicRoutes;