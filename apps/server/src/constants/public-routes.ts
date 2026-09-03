import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { errorHtml } from './error_page';

const BASE_ADMIN_DIR = path.join('public', 'admin');
const BASE_ERROR_DIR = path.join('public', 'error');

/**
 * Single source of truth for public HTML routes.
 */
export class PublicRoutes {



    static readonly ERROR_PAGE = path.join(BASE_ERROR_DIR, 'unavailable_page.html')
    static readonly NO_PAGE_FOUND = path.join(BASE_ERROR_DIR, 'no_page_found.html')

    static readonly LOGIN = path.join(BASE_ADMIN_DIR, 'login', 'login.html')
    static readonly DASHBOARD = path.join(BASE_ADMIN_DIR, 'dashboard', 'index.html')
}

/**
 * Reads HTML files defined by PublicRoutes.
 */
export class PublicHtmlFiles {
    private static readonly cache = new Map<string, string>()

    /**
     * Reads and returns HTML file content.
     *
     * Cached in memory by default.
     * Pass `{ cache: false }` to force a fresh read.
     */
    static async getHtml(
        filePath: string,
        options?: { cache?: boolean },
    ): Promise<string> {
        const useCache = options?.cache ?? true

        if (useCache) {
            const cached = this.cache.get(filePath)

            if (cached !== undefined) {
                return cached
            }
        }

        const absolutePath = path.join(process.cwd(), filePath)

        try {
            console.info(`Reading HTML file from disk: ${absolutePath}`);
            const html = await readFile(absolutePath, 'utf8')

            if (useCache) {
                this.cache.set(filePath, html)
            }

            console.info(`Successfully read HTML file: ${absolutePath}`);
            return html
        } catch (error) {
            try {
                const errorPage = await readFile(path.join(process.cwd(), PublicRoutes.ERROR_PAGE), 'utf8');
                return errorPage;
            } catch (err) {
                console.error(`Failed to read error HTML file "${PublicRoutes.ERROR_PAGE}": ${(err as Error).message}`);
                return errorHtml; // Return the default error HTML if reading the error page fails
            }
        }
    }

    /**
     * Clears the HTML cache.
     *
     * Clears all cached files when no path is provided,
     * or only the specified file when one is provided.
     */
    static clearCache(filePath?: string): void {
        if (filePath) {
            this.cache.delete(filePath)
        } else {
            this.cache.clear()
        }
    }
}

export default PublicHtmlFiles
